import {
  DETECT_FORMAT_BYTES,
  type DecompressionFormat,
  HtpDecompressionError,
  type HtpDecompressionErrorCode,
  HtpDecompressionStream,
  detectFormat
} from 'htp-decompress';

/** How many leading bytes of a file are enough to tell every supported format apart, as in hashcat. */
export const COMPRESSION_HEADER_BYTES = DETECT_FORMAT_BYTES;

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
 * Decoders are async because their WebAssembly is loaded with a dynamic `import()` only when such a
 * file is opened, keeping it out of the main bundle.
 */
export interface CompressedFormat {
  /** Name shown in the preview's header. */
  name: DecompressionFormat;
  /**
   * Decompresses the start of a file. Being handed a prefix that stops mid-stream is the normal case
   * and not an error: the result then holds what the prefix decoded to.
   *
   * Damage ends the result about where the decoder notices it: gzip, and zstd without checksums, may
   * hand out some wrong bytes before that, and xz may stop up to one 64 KiB decode pass short of it.
   *
   * When the decoder fails to load, or the file needs a feature or more memory than the decoder
   * supports, the promise rejects with a message saying why, unless some of the file was decoded
   * first: the result then ends there instead.
   *
   * Once `options.signal` is aborted, decoding stops and the promise rejects with the signal's reason,
   * as `fetch` does.
   */
  decode(input: Uint8Array<ArrayBuffer>, options: DecodeOptions): Promise<DecodeResult>;
}

/**
 * Largest zstd window or xz dictionary a file may declare, in bytes: the most the decoder can address.
 * Its memory follows the decoded output, which the preview caps, rather than what a file declares, so
 * no file needs refusing for its window or dictionary.
 */
const MEMORY_LIMIT_BYTES = 4_294_967_295;

/**
 * Decoder errors after which the output so far is all there is to show of the file: it is cut off,
 * damaged, or followed by bytes that start no further stream.
 */
const DAMAGE_CODES: readonly HtpDecompressionErrorCode[] = ['truncated', 'corrupt', 'trailing-data'];

/** The formats the preview can decompress: those hashcat reads natively. */
const COMPRESSION_FORMATS: Record<DecompressionFormat, CompressedFormat> = {
  gzip: compressedFormat('gzip'),
  xz: compressedFormat('xz'),
  zstd: compressedFormat('zstd')
};

/**
 * Finds the compressed format a file's first bytes belong to, by the magic numbers hashcat checks.
 *
 * @param head - The file's first bytes, up to {@link COMPRESSION_HEADER_BYTES} of them.
 * @returns The format, or `null` for a file that is not compressed in a supported format.
 */
export function detectCompression(head: Uint8Array): CompressedFormat | null {
  const format = detectFormat(head);
  return format === null ? null : COMPRESSION_FORMATS[format];
}

function compressedFormat(name: DecompressionFormat): CompressedFormat {
  return { name, decode: (input, options) => decode(name, input, options) };
}

/**
 * Decompresses with htp-decompress, which hands out everything decoded before a cut-off or damage and
 * only then the error saying why it stopped.
 *
 * @param format - The stream format to decode.
 * @param input - The start of the file, or all of it.
 * @param options - Whether that is the whole file, where to stop, and what cancels decoding.
 */
async function decode(
  format: DecompressionFormat,
  input: Uint8Array<ArrayBuffer>,
  { isWholeFile, maxOutputBytes, signal }: DecodeOptions
): Promise<DecodeResult> {
  signal?.throwIfAborted();

  const stream = new HtpDecompressionStream(format, { memoryLimit: MEMORY_LIMIT_BYTES });

  // The decoder takes the input only as fast as the reader below pulls output. The writer's promises
  // settle once it has, and fail with the reader's error or cancel when decoding ends early.
  const writer = stream.writable.getWriter();
  writer.write(input).catch(() => undefined);
  writer.close().catch(() => undefined);

  const reader = stream.readable.getReader();

  // Cancelling the reader settles a read that is still waiting, so the loop below notices the abort
  // right away instead of after the decoder's next chunk.
  const cancelReader = (): void => void reader.cancel().catch(() => undefined);
  signal?.addEventListener('abort', cancelReader, { once: true });

  const chunks: Uint8Array[] = [];
  let produced = 0;
  let isStreamDone = false;
  let failure: unknown;
  try {
    // Output that exactly fills the cap gets one more read, so a stream ending right there still
    // counts as complete; only output past the cap means the file goes on.
    while (produced <= maxOutputBytes && !signal?.aborted) {
      const { done, value } = await reader.read();
      if (done) {
        isStreamDone = true;
        break;
      }

      chunks.push(value);
      produced += value.length;
    }
  } catch (error) {
    failure = error;
  } finally {
    signal?.removeEventListener('abort', cancelReader);
  }

  // Past the cap, this stops the decoder and frees its memory.
  if (!isStreamDone) {
    await reader.cancel().catch(() => undefined);
  }

  signal?.throwIfAborted();

  if (failure !== undefined && produced === 0 && !isDamage(failure)) {
    throw new Error(`Could not decompress the ${format} file (${messageOf(failure)}).`);
  }

  const bytes = new Uint8Array(Math.min(produced, maxOutputBytes));
  let position = 0;
  for (const chunk of chunks) {
    const part = chunk.subarray(0, bytes.length - position);
    bytes.set(part, position);
    position += part.length;
  }

  return { bytes, reachedEnd: isStreamDone && isWholeFile };
}

function isDamage(error: unknown): boolean {
  return error instanceof HtpDecompressionError && DAMAGE_CODES.includes(error.code);
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
