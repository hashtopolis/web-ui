import { formatFileSize } from '@src/app/shared/utils/util';

/** How many leading bytes of a file are enough to tell every supported format apart, as in hashcat. */
export const COMPRESSION_HEADER_BYTES = 8;

/** Limits for one run of a decoder. */
export interface DecodeOptions {
  /**
   * Whether `input` is the whole file. Only then can a stream that ends cleanly be taken as the end
   * of the file's content.
   */
  isWholeFile: boolean;
  /** Decompressed bytes after which decoding stops. */
  maxOutputBytes: number;
  /** Cancels decoding, for example when the preview closes before the file has opened. */
  signal?: AbortSignal;
}

/** What a decoder made of its input. */
export interface DecodeResult {
  /** The decompressed bytes, at most `maxOutputBytes` of them. */
  bytes: Uint8Array;
  /**
   * True only when the whole file was decoded to the clean end of its stream. A cut-off input, the
   * output cap and damage all leave it false.
   */
  reachedEnd: boolean;
}

/**
 * A compressed format the preview can read.
 *
 * Decoders are async so that a format needing a decoder library can load it with a dynamic
 * `import()` only when such a file is opened, keeping it out of the main bundle.
 */
export interface CompressedFormat {
  /** Name shown in the preview's header. */
  name: string;
  /** Whether the file's first bytes (up to {@link COMPRESSION_HEADER_BYTES}) carry this format's header. */
  matches(head: Uint8Array): boolean;
  /**
   * Decompresses the start of a file. Being handed a prefix that stops mid-stream is the normal case
   * and not an error: the result then holds what the prefix decoded to. Once `options.signal` is
   * aborted, decoding stops and the promise rejects with the signal's reason, as `fetch` does.
   */
  decode(input: Uint8Array<ArrayBuffer>, options: DecodeOptions): Promise<DecodeResult>;
}

/**
 * Input slice fed to a decoder at a time. A decoder turns a whole slice into output before it can be
 * stopped, and these formats expand by up to about 1000x, so the slice size bounds how far a highly
 * compressible file can overshoot the output cap.
 */
const SLICE_BYTES = 16_384;

/** Input the zstd decoder, which runs synchronously, works through before giving the browser a turn. */
const ZSTD_INPUT_PER_TURN_BYTES = 131_072;

/**
 * Largest zstd window the preview decodes. The zstd decoder reserves the whole window before decoding
 * anything; zstd's normal levels stay at or below 8 MiB, while `--long` and `--ultra -22` use 128 MiB.
 */
const MAX_ZSTD_WINDOW_BYTES = 33_554_432;

const GZIP: CompressedFormat = {
  name: 'gzip',
  // The method byte is checked too, as hashcat does: deflate is the only method gzip defines.
  matches: (head) => startsWith(head, [0x1f, 0x8b, 0x08]),
  decode: async (input, options) =>
    drainStream(sliceStream(input).pipeThrough(new DecompressionStream('gzip')), options)
};

const XZ: CompressedFormat = {
  name: 'xz',
  matches: (head) => startsWith(head, [0xfd, 0x37, 0x7a, 0x58, 0x5a, 0x00]),
  decode: async (input, options) => {
    options.signal?.throwIfAborted();

    // No browser decodes xz, so a WebAssembly build of xz-embedded does, loaded only for xz files.
    const { XzReadableStream } = await import('xz-decompress');
    return drainStream(new XzReadableStream(sliceStream(input)), options);
  }
};

const ZSTD: CompressedFormat = {
  name: 'zstd',
  // pzstd starts its files with a skippable frame rather than a regular one.
  matches: (head) => startsWith(head, [0x28, 0xb5, 0x2f, 0xfd]) || isZstdSkippableFrame(head),
  decode: decodeZstd
};

/** Formats the preview can decompress, checked in order against a file's first bytes. */
const COMPRESSION_FORMATS: readonly CompressedFormat[] = [GZIP, XZ, ZSTD];

/**
 * Finds the compressed format a file's first bytes belong to.
 *
 * @param head - The file's first bytes, up to {@link COMPRESSION_HEADER_BYTES} of them.
 * @returns The format, or `null` for a file that is not compressed in a supported format.
 */
export function detectCompression(head: Uint8Array): CompressedFormat | null {
  return COMPRESSION_FORMATS.find((format) => format.matches(head)) ?? null;
}

function startsWith(bytes: Uint8Array, prefix: readonly number[]): boolean {
  return bytes.length >= prefix.length && prefix.every((byte, index) => bytes[index] === byte);
}

/** Whether `bytes` start with a zstd skippable frame, whose magic is anything from `50` to `5f 2a 4d 18`. */
function isZstdSkippableFrame(bytes: Uint8Array): boolean {
  return bytes.length >= 4 && (bytes[0] & 0xf0) === 0x50 && bytes[1] === 0x2a && bytes[2] === 0x4d && bytes[3] === 0x18;
}

/**
 * Hands `input` to a decoder in slices, only as fast as the decoder asks for them, so stopping the
 * decoder stops the feed.
 */
function sliceStream(input: Uint8Array<ArrayBuffer>): ReadableStream<Uint8Array<ArrayBuffer>> {
  let fed = 0;
  return new ReadableStream<Uint8Array<ArrayBuffer>>(
    {
      pull(controller) {
        if (fed >= input.length) {
          controller.close();
          return;
        }

        controller.enqueue(input.subarray(fed, fed + SLICE_BYTES));
        fed += SLICE_BYTES;
      }
    },
    { highWaterMark: 0 }
  );
}

/** Collects decoder output up to the cap, dropping whatever goes past it. */
class OutputCollector {
  private readonly chunks: Uint8Array[] = [];
  private length = 0;
  private overflowed = false;

  constructor(private readonly maxBytes: number) {}

  /**
   * Whether output arrived past the cap, so the file goes on beyond what the collector keeps. Output
   * that exactly fills the cap is not an overflow: the stream may end right there.
   */
  get hasOverflowed(): boolean {
    return this.overflowed;
  }

  add(chunk: Uint8Array): void {
    const room = this.maxBytes - this.length;
    if (chunk.length > room) {
      this.overflowed = true;
    }

    if (room <= 0) {
      return;
    }

    const part = chunk.subarray(0, room);
    this.chunks.push(part);
    this.length += part.length;
  }

  bytes(): Uint8Array {
    const bytes = new Uint8Array(this.length);
    let position = 0;
    for (const chunk of this.chunks) {
      bytes.set(chunk, position);
      position += chunk.length;
    }

    return bytes;
  }
}

/**
 * Reads a decoder's output stream until it ends, fails, goes past the cap or is cancelled.
 *
 * @param decompressed - The decoder's output.
 * @param options - Whether the input is the whole file, where to stop, and what cancels decoding.
 */
async function drainStream(
  decompressed: ReadableStream<Uint8Array>,
  { isWholeFile, maxOutputBytes, signal }: DecodeOptions
): Promise<DecodeResult> {
  const reader = decompressed.getReader();

  // Cancelling the reader settles a read that is still waiting, so the loop below notices the abort
  // right away instead of after the decoder's next chunk.
  const cancelReader = (): void => void reader.cancel().catch(() => undefined);
  signal?.addEventListener('abort', cancelReader, { once: true });

  const output = new OutputCollector(maxOutputBytes);
  let isStreamDone = false;
  try {
    // Output that exactly fills the cap gets one more read, so a stream ending right there still
    // counts as complete; only output past the cap means the file goes on.
    while (!output.hasOverflowed && !signal?.aborted) {
      const { done, value } = await reader.read();
      if (done) {
        isStreamDone = true;
        break;
      }

      output.add(value);
    }
  } catch {
    // A prefix that stops mid-stream ends the decoder in an error, and so does damage. Either way the
    // bytes decoded so far stand on their own.
  } finally {
    signal?.removeEventListener('abort', cancelReader);
  }

  // Cancel before anything else, abort included: xz's decoder runs one stream at a time, so a stream
  // left open would hold up every later preview.
  if (!isStreamDone) {
    await reader.cancel().catch(() => undefined);
  }

  signal?.throwIfAborted();

  return { bytes: output.bytes(), reachedEnd: isStreamDone && isWholeFile };
}

/**
 * Decompresses zstd with fzstd, which takes pushed input rather than a stream. Driving it with a loop,
 * rather than wrapping it in a stream, keeps the output decoded before a cut-off or damage: an
 * erroring stream discards output it has not handed over yet.
 *
 * @param input - The start of the file, or all of it.
 * @param options - Whether that is the whole file, where to stop, and what cancels decoding.
 */
async function decodeZstd(
  input: Uint8Array<ArrayBuffer>,
  { isWholeFile, maxOutputBytes, signal }: DecodeOptions
): Promise<DecodeResult> {
  signal?.throwIfAborted();
  assertZstdWindowFits(input);

  // No browser decodes zstd, so fzstd does, loaded only for zstd files.
  const { Decompress } = await import('fzstd');

  const output = new OutputCollector(maxOutputBytes);
  const decoder = new Decompress((chunk) => output.add(chunk));
  let reachedEnd = false;
  try {
    for (let fed = 0; fed < input.length && !output.hasOverflowed && !signal?.aborted; fed += SLICE_BYTES) {
      decoder.push(input.subarray(fed, fed + SLICE_BYTES));

      // The decoder runs synchronously, so give the browser a turn now and then to let an abort in.
      if ((fed + SLICE_BYTES) % ZSTD_INPUT_PER_TURN_BYTES === 0) {
        await new Promise((resolve) => setTimeout(resolve));
      }
    }

    // Only a whole file is told that its input has ended: on a cut-off prefix that throws.
    if (isWholeFile && !output.hasOverflowed && !signal?.aborted) {
      decoder.push(new Uint8Array(0), true);
      reachedEnd = true;
    }
  } catch {
    // Damage. What was decoded before it stands, as with the other formats.
  }

  signal?.throwIfAborted();

  return { bytes: output.bytes(), reachedEnd };
}

/** Refuses a zstd file whose window would take more memory than the preview allows. */
function assertZstdWindowFits(input: Uint8Array): void {
  const windowBytes = zstdWindowBytes(input);
  if (windowBytes !== null && windowBytes > MAX_ZSTD_WINDOW_BYTES) {
    throw new Error(
      `This zstd file needs ${formatFileSize(windowBytes)} of memory to decode, more than the preview allows.`
    );
  }
}

/**
 * Reads the window size of a zstd file's first frame from its header, past any skippable frames.
 *
 * @returns The window in bytes, or `null` when the input ends before the header does.
 */
function zstdWindowBytes(input: Uint8Array): number | null {
  const view = new DataView(input.buffer, input.byteOffset, input.byteLength);

  let at = 0;
  while (at + 8 <= input.length && isZstdSkippableFrame(input.subarray(at))) {
    at += 8 + view.getUint32(at + 4, true);
  }

  if (at + 6 > input.length) {
    return null;
  }

  const descriptor = input[at + 4];

  // A window descriptor holds a power of two and eighths of it on top.
  if ((descriptor & 0x20) === 0) {
    const base = 2 ** (10 + (input[at + 5] >> 3));
    return base + (base / 8) * (input[at + 5] & 0x07);
  }

  // A single-segment frame has no window descriptor: its window is its content size, which follows
  // the dictionary id.
  const contentSizeAt = at + 5 + [0, 1, 2, 4][descriptor & 0x03];
  const contentSizeBytes = [1, 2, 4, 8][descriptor >> 6];
  if (contentSizeAt + contentSizeBytes > input.length) {
    return null;
  }

  switch (contentSizeBytes) {
    case 1:
      return input[contentSizeAt];
    case 2:
      return view.getUint16(contentSizeAt, true) + 256;
    case 4:
      return view.getUint32(contentSizeAt, true);
    default:
      return Number(view.getBigUint64(contentSizeAt, true));
  }
}
