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
 * Input slice fed to the browser's decoder at a time. The decoder turns a whole slice into output
 * before the reader gets a chance to stop it, and deflate expands by up to about 1000x, so the slice
 * size bounds how far a highly compressible file can overshoot the output cap.
 */
const BROWSER_DECODER_SLICE_BYTES = 16_384;

const GZIP: CompressedFormat = {
  name: 'gzip',
  // The method byte is checked too, as hashcat does: deflate is the only method gzip defines.
  matches: (head) => head.length >= 3 && head[0] === 0x1f && head[1] === 0x8b && head[2] === 0x08,
  decode: (input, options) => decodeWithBrowser('gzip', input, options)
};

/** Formats the preview can decompress, checked in order against a file's first bytes. */
const COMPRESSION_FORMATS: readonly CompressedFormat[] = [GZIP];

/**
 * Finds the compressed format a file's first bytes belong to.
 *
 * @param head - The file's first bytes, up to {@link COMPRESSION_HEADER_BYTES} of them.
 * @returns The format, or `null` for a file that is not compressed in a supported format.
 */
export function detectCompression(head: Uint8Array): CompressedFormat | null {
  return COMPRESSION_FORMATS.find((format) => format.matches(head)) ?? null;
}

/**
 * Decompresses with the browser's built-in `DecompressionStream`.
 *
 * @param format - The stream format to decode.
 * @param input - The start of the file, or all of it.
 * @param options - Whether that is the whole file, where to stop, and what cancels decoding.
 */
async function decodeWithBrowser(
  format: CompressionFormat,
  input: Uint8Array<ArrayBuffer>,
  { isWholeFile, maxOutputBytes, signal }: DecodeOptions
): Promise<DecodeResult> {
  signal?.throwIfAborted();

  let fed = 0;
  const slices = new ReadableStream<BufferSource>(
    {
      pull(controller) {
        if (fed >= input.length) {
          controller.close();
          return;
        }

        controller.enqueue(input.subarray(fed, fed + BROWSER_DECODER_SLICE_BYTES));
        fed += BROWSER_DECODER_SLICE_BYTES;
      }
    },
    // Hand out a slice only when the decoder asks for one, so stopping the reader stops the feed.
    { highWaterMark: 0 }
  );

  const reader = slices.pipeThrough(new DecompressionStream(format)).getReader();

  // Cancelling the reader settles a read that is still waiting, so the loop below notices the abort
  // right away instead of after the decoder's next chunk.
  const cancelReader = (): void => void reader.cancel().catch(() => undefined);
  signal?.addEventListener('abort', cancelReader, { once: true });

  const chunks: Uint8Array[] = [];
  let produced = 0;
  let isStreamDone = false;
  try {
    while (produced < maxOutputBytes && !signal?.aborted) {
      const { done, value } = await reader.read();
      if (done) {
        isStreamDone = true;
        break;
      }

      chunks.push(value);
      produced += value.length;
    }
  } catch {
    // A prefix that stops mid-stream ends the decoder in an error, and so does damage. Either way the
    // bytes decoded so far stand on their own.
  } finally {
    signal?.removeEventListener('abort', cancelReader);
  }

  signal?.throwIfAborted();

  if (!isStreamDone) {
    await reader.cancel().catch(() => undefined);
  }

  const bytes = new Uint8Array(Math.min(produced, maxOutputBytes));
  let position = 0;
  for (const chunk of chunks) {
    const part = chunk.subarray(0, bytes.length - position);
    bytes.set(part, position);
    position += part.length;
  }

  return { bytes, reachedEnd: isStreamDone && isWholeFile && produced <= maxOutputBytes };
}
