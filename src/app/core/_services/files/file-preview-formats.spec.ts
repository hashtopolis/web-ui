import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { gzipSync, zstdCompressSync } from 'node:zlib';

import { CompressedFormat, detectCompression } from '@services/files/file-preview-formats';
import { numberedLines, randomHexLines } from '@services/files/testing/preview-text';

const encode = (text: string): Uint8Array => new TextEncoder().encode(text);

const decode = (bytes: Uint8Array): string => new TextDecoder().decode(bytes);

/** The texts the decoders are tested on. The xz fixtures are named after these keys. */
const SAMPLES = {
  'numbered-10': () => numberedLines(10),
  'numbered-40': () => numberedLines(40),
  'numbered-80': () => numberedLines(80),
  'numbered-1000': () => numberedLines(1_000),
  'random-hex-5000': () => randomHexLines(5_000),
  'a-lines-4194304': () => 'a\n'.repeat(4_194_304),
  empty: () => ''
} as const;

type Sample = keyof typeof SAMPLES;

/** How a format's test inputs are made. Node writes gzip and zstd; xz comes from committed fixtures. */
interface FormatCase {
  name: string;
  /** The header a file of this format starts with. */
  header: number[];
  compress(sample: Sample): Uint8Array<ArrayBuffer>;
  /** A valid start of the format followed by data its decoder rejects. */
  damaged: Uint8Array<ArrayBuffer>;
}

const xzFixture = (sample: Sample): Uint8Array<ArrayBuffer> =>
  new Uint8Array(readFileSync(resolve('src/app/core/_services/files/testing/fixtures', `${sample}.txt.xz`)));

/**
 * Compresses `text` as zstd in frames of 16 KiB of text each, as pzstd writes files. The zstd decoder
 * hands out output a finished block at a time, and Node cannot shrink zstd's block size, so this is
 * how even a small sample gets several blocks, as a large file has.
 */
const zstdFrames = (text: string): Uint8Array<ArrayBuffer> => {
  const bytes = encode(text);
  const frames: Uint8Array[] = [];
  for (let at = 0; at === 0 || at < bytes.length; at += 16_384) {
    frames.push(zstdCompressSync(bytes.subarray(at, at + 16_384)));
  }

  const joined = new Uint8Array(frames.reduce((total, frame) => total + frame.length, 0));
  let position = 0;
  for (const frame of frames) {
    joined.set(frame, position);
    position += frame.length;
  }

  return joined;
};

const FORMATS: FormatCase[] = [
  {
    name: 'gzip',
    header: [0x1f, 0x8b, 0x08],
    compress: (sample) => new Uint8Array(gzipSync(SAMPLES[sample]())),
    damaged: new Uint8Array([0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0xff, 0xff, 0xff, 0xff])
  },
  {
    name: 'xz',
    header: [0xfd, 0x37, 0x7a, 0x58, 0x5a, 0x00],
    compress: xzFixture,
    // A valid stream header, then a block header that cannot be one.
    damaged: new Uint8Array([...xzFixture('numbered-10').subarray(0, 12), ...new Array(16).fill(0xff)])
  },
  {
    name: 'zstd',
    header: [0x28, 0xb5, 0x2f, 0xfd],
    compress: (sample) => zstdFrames(SAMPLES[sample]()),
    // A frame header with a 1 KiB window, then a block of the reserved type.
    damaged: new Uint8Array([0x28, 0xb5, 0x2f, 0xfd, 0x00, 0x00, ...new Array(8).fill(0xff)])
  }
];

/** A zstd skippable frame with four bytes of payload, which pzstd puts in front of every file. */
const ZSTD_SKIPPABLE_FRAME = [0x50, 0x2a, 0x4d, 0x18, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];

describe('detectCompression', () => {
  it.each(FORMATS)('recognises a $name header', ({ name, header }) => {
    expect(detectCompression(new Uint8Array([...header, 0x00, 0x00]))?.name).toBe(name);
  });

  it('recognises a zstd file that starts with a skippable frame', () => {
    expect(detectCompression(new Uint8Array(ZSTD_SKIPPABLE_FRAME.slice(0, 8)))?.name).toBe('zstd');
  });

  it('treats plain text as uncompressed', () => {
    expect(detectCompression(encode('password'))).toBeNull();
  });

  it('requires the deflate method byte after the gzip magic, as hashcat does', () => {
    expect(detectCompression(new Uint8Array([0x1f, 0x8b, 0x00, 0x00]))).toBeNull();
  });

  it('requires the whole six-byte xz magic', () => {
    expect(detectCompression(new Uint8Array([0xfd, 0x37, 0x7a, 0x58, 0x5a, 0x01, 0x00, 0x00]))).toBeNull();
  });

  it('treats a file shorter than any header as uncompressed', () => {
    expect(detectCompression(new Uint8Array([0x1f, 0x8b]))).toBeNull();
  });
});

describe.each(FORMATS)('$name decoder', (format) => {
  let decoder: CompressedFormat;

  beforeEach(() => {
    decoder = detectCompression(new Uint8Array([...format.header, 0x00, 0x00]))!;
  });

  it('decodes a whole file to its end', async () => {
    const result = await decoder.decode(format.compress('numbered-1000'), {
      isWholeFile: true,
      maxOutputBytes: 1_048_576
    });

    expect(decode(result.bytes)).toBe(numberedLines(1_000));
    expect(result.reachedEnd).toBe(true);
  });

  it('decodes a whole file that spans several input slices to its end', async () => {
    const compressed = format.compress('random-hex-5000');

    const result = await decoder.decode(compressed, { isWholeFile: true, maxOutputBytes: 16_777_216 });

    expect(compressed.length, 'the fixture spans several 16 KiB slices').toBeGreaterThan(32_768);
    expect(decode(result.bytes)).toBe(randomHexLines(5_000));
    expect(result.reachedEnd).toBe(true);
  });

  it('never claims the end of a file of several streams while showing only part of it', async () => {
    // Decoders differ here: Chrome's gzip decoder stops after the first member, the others read on.
    // Either is fine as long as a partial result is not passed off as the whole file.
    const whole = numberedLines(40) + numberedLines(80);

    const result = await decoder.decode(
      new Uint8Array([...format.compress('numbered-40'), ...format.compress('numbered-80')]),
      { isWholeFile: true, maxOutputBytes: 1_048_576 }
    );

    const decoded = decode(result.bytes);
    expect(decoded.length).toBeGreaterThan(0);
    expect(whole.startsWith(decoded)).toBe(true);
    expect(result.reachedEnd).toBe(decoded === whole);
  });

  it('decodes what a cut-off prefix holds without failing', async () => {
    const compressed = format.compress('random-hex-5000');

    const result = await decoder.decode(compressed.subarray(0, compressed.length >> 1), {
      isWholeFile: false,
      maxOutputBytes: 16_777_216
    });

    const text = randomHexLines(5_000);
    expect(result.bytes.length).toBeGreaterThan(0);
    expect(result.bytes.length).toBeLessThan(text.length);
    expect(text.startsWith(decode(result.bytes))).toBe(true);
    expect(result.reachedEnd).toBe(false);
  });

  it('stops at the output cap', async () => {
    const result = await decoder.decode(format.compress('a-lines-4194304'), {
      isWholeFile: true,
      maxOutputBytes: 65_536
    });

    expect(result.bytes.length).toBe(65_536);
    expect(decode(result.bytes)).toBe('a\n'.repeat(32_768));
    expect(result.reachedEnd).toBe(false);
  });

  it('reaches the end of a file whose output exactly fills the cap', async () => {
    // The sample decodes to exactly 8 MiB.
    const result = await decoder.decode(format.compress('a-lines-4194304'), {
      isWholeFile: true,
      maxOutputBytes: 8_388_608
    });

    expect(result.bytes.length).toBe(8_388_608);
    expect(result.reachedEnd).toBe(true);
  });

  it('does not claim the end of a file it was only given the start of', async () => {
    // The prefix happens to hold a complete stream, but the file goes on after it.
    const result = await decoder.decode(format.compress('numbered-10'), {
      isWholeFile: false,
      maxOutputBytes: 1_048_576
    });

    expect(decode(result.bytes)).toBe(numberedLines(10));
    expect(result.reachedEnd).toBe(false);
  });

  it('reports a damaged file as not reaching its end instead of failing', async () => {
    const result = await decoder.decode(format.damaged, { isWholeFile: true, maxOutputBytes: 1_048_576 });

    expect(result.reachedEnd).toBe(false);
  });

  it('decodes an empty stream to nothing, reaching its end', async () => {
    const result = await decoder.decode(format.compress('empty'), { isWholeFile: true, maxOutputBytes: 1_048_576 });

    expect(result.bytes.length).toBe(0);
    expect(result.reachedEnd).toBe(true);
  });

  it('does not start decoding once it was cancelled', async () => {
    const controller = new AbortController();
    controller.abort();

    const decoding = decoder.decode(format.compress('numbered-10'), {
      isWholeFile: true,
      maxOutputBytes: 1_048_576,
      signal: controller.signal
    });

    await expect(decoding).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('stops decoding when cancelled while it runs', async () => {
    const controller = new AbortController();
    const decoding = decoder.decode(format.compress('a-lines-4194304'), {
      isWholeFile: true,
      maxOutputBytes: 16_777_216,
      signal: controller.signal
    });

    // The decoder is waiting on its first read or on loading its library by the time the call
    // returns, so this cancels it midway.
    controller.abort();

    await expect(decoding).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('decodes again after a cancelled run, so a closed preview never blocks the next one', async () => {
    const controller = new AbortController();
    const cancelled = decoder.decode(format.compress('a-lines-4194304'), {
      isWholeFile: true,
      maxOutputBytes: 16_777_216,
      signal: controller.signal
    });
    controller.abort();
    await cancelled.catch(() => undefined);

    const result = await decoder.decode(format.compress('numbered-10'), {
      isWholeFile: true,
      maxOutputBytes: 1_048_576
    });

    expect(decode(result.bytes)).toBe(numberedLines(10));
  });
});

describe('zstd decoder', () => {
  const zstd = detectCompression(new Uint8Array([0x28, 0xb5, 0x2f, 0xfd]))!;

  /** A zstd frame header without content size whose window descriptor byte is `windowDescriptor`. */
  const frameHeader = (windowDescriptor: number): number[] => [0x28, 0xb5, 0x2f, 0xfd, 0x00, windowDescriptor];

  it('decodes a file that starts with a skippable frame, as pzstd writes them', async () => {
    const input = new Uint8Array([...ZSTD_SKIPPABLE_FRAME, ...zstdCompressSync(numberedLines(1_000))]);

    const result = await zstd.decode(input, { isWholeFile: true, maxOutputBytes: 1_048_576 });

    expect(decode(result.bytes)).toBe(numberedLines(1_000));
    expect(result.reachedEnd).toBe(true);
  });

  it('refuses a file needing a window larger than 32 MiB before decoding any of it', async () => {
    // 2^27 bytes, the window of `zstd --long` and `zstd --ultra -22`.
    const decoding = zstd.decode(new Uint8Array(frameHeader(0x88)), { isWholeFile: true, maxOutputBytes: 1_048_576 });

    await expect(decoding).rejects.toThrow('This zstd file needs 128 MB of memory to decode');
  });

  it('accepts a window of exactly 32 MiB', async () => {
    const decoding = zstd.decode(new Uint8Array(frameHeader(0x78)), { isWholeFile: true, maxOutputBytes: 1_048_576 });

    await expect(decoding).resolves.toMatchObject({ reachedEnd: false });
  });

  it('takes the window of a single-segment frame from its content size', async () => {
    // Single segment with a four-byte content size of 64 MiB.
    const input = new Uint8Array([0x28, 0xb5, 0x2f, 0xfd, 0xa0, 0x00, 0x00, 0x00, 0x04]);

    const decoding = zstd.decode(input, { isWholeFile: true, maxOutputBytes: 1_048_576 });

    await expect(decoding).rejects.toThrow('This zstd file needs 64 MB of memory to decode');
  });

  it('reads the window of the first frame after a skippable frame', async () => {
    const input = new Uint8Array([...ZSTD_SKIPPABLE_FRAME, ...frameHeader(0x88)]);

    const decoding = zstd.decode(input, { isWholeFile: true, maxOutputBytes: 1_048_576 });

    await expect(decoding).rejects.toThrow('This zstd file needs 128 MB of memory to decode');
  });
});
