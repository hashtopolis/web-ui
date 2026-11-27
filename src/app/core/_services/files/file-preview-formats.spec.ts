import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { gzipSync, zstdCompressSync } from 'node:zlib';

import { CompressedFormat, DecodeOptions, detectCompression } from '@services/files/file-preview-formats';
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
  /** A valid start of the format followed by bytes its decoder cannot get past. */
  brokenAfterHeader: Uint8Array<ArrayBuffer>;
  /** Damages a compressed file well into its data, in a way the decoder notices. */
  damageMidway(compressed: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer>;
}

/** Options for a whole file of at most 1 MiB of text. */
const WHOLE_FILE: DecodeOptions = { isWholeFile: true, maxOutputBytes: 1_048_576 };

const fixtureFile = (name: string): Uint8Array<ArrayBuffer> =>
  new Uint8Array(readFileSync(resolve('src/app/core/_services/files/testing/fixtures', name)));

const xzFixture = (sample: Sample): Uint8Array<ArrayBuffer> => fixtureFile(`${sample}.txt.xz`);

/** `parts` joined into one file. */
const concat = (...parts: Uint8Array[]): Uint8Array<ArrayBuffer> => new Uint8Array(parts.flatMap((part) => [...part]));

/** A copy of `bytes` with every bit of the byte at `at` flipped. */
const flipByte = (bytes: Uint8Array<ArrayBuffer>, at: number): Uint8Array<ArrayBuffer> => {
  const flipped = bytes.slice();
  flipped[at] ^= 0xff;

  return flipped;
};

/**
 * A copy of zstd `frames` whose third frame has a broken magic number. Node writes zstd frames without
 * a checksum, so damage to compressed data could decode to wrong text unnoticed; a broken frame start
 * never goes unnoticed.
 */
const breakThirdZstdFrame = (frames: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer> => {
  let frameCount = 0;
  for (let at = 0; at + 4 <= frames.length; at++) {
    const isFrameStart =
      frames[at] === 0x28 && frames[at + 1] === 0xb5 && frames[at + 2] === 0x2f && frames[at + 3] === 0xfd;
    if (isFrameStart && ++frameCount === 3) {
      return flipByte(frames, at);
    }
  }

  throw new Error('The fixture has fewer than three zstd frames.');
};

/**
 * Compresses `text` as zstd in frames of 16 KiB of text each, as pzstd writes files, so that even a
 * small sample spans several frames, as a large file does.
 */
const zstdFrames = (text: string): Uint8Array<ArrayBuffer> => {
  const bytes = encode(text);
  const frames: Uint8Array[] = [];
  for (let at = 0; at === 0 || at < bytes.length; at += 16_384) {
    frames.push(zstdCompressSync(bytes.subarray(at, at + 16_384)));
  }

  return concat(...frames);
};

/**
 * A zstd frame holding `text` in a single raw block. `header` is the frame header after the magic
 * number: the frame header descriptor, then the window descriptor and dictionary id it calls for.
 */
const rawZstdFrame = (header: number[], text: string): Uint8Array<ArrayBuffer> => {
  const bytes = encode(text);

  // Three little-endian bytes: the size, then the block type (raw is 0) and the last-block flag.
  const blockHeader = (bytes.length << 3) | 0x01;
  const blockHeaderBytes = [blockHeader & 0xff, (blockHeader >> 8) & 0xff, blockHeader >> 16];

  return concat(new Uint8Array([0x28, 0xb5, 0x2f, 0xfd, ...header, ...blockHeaderBytes]), bytes);
};

const FORMATS: FormatCase[] = [
  {
    name: 'gzip',
    header: [0x1f, 0x8b, 0x08],
    compress: (sample) => new Uint8Array(gzipSync(SAMPLES[sample]())),
    brokenAfterHeader: new Uint8Array([
      0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0xff, 0xff, 0xff, 0xff
    ]),
    // The deflate data goes wrong from the middle on, and the CRC at the end fails at the latest.
    damageMidway: (compressed) => flipByte(compressed, compressed.length >> 1)
  },
  {
    name: 'xz',
    header: [0xfd, 0x37, 0x7a, 0x58, 0x5a, 0x00],
    compress: xzFixture,
    // A valid stream header, then a block header announcing more bytes than follow.
    brokenAfterHeader: new Uint8Array([...xzFixture('numbered-10').subarray(0, 12), ...new Array(16).fill(0xff)]),
    // Inside the fifth of the multi-block fixture's blocks, whose check then fails.
    damageMidway: (compressed) => flipByte(compressed, 20_000)
  },
  {
    name: 'zstd',
    header: [0x28, 0xb5, 0x2f, 0xfd],
    compress: (sample) => zstdFrames(SAMPLES[sample]()),
    // A frame header with a 1 KiB window, then a block header announcing more bytes than follow.
    brokenAfterHeader: new Uint8Array([0x28, 0xb5, 0x2f, 0xfd, 0x00, 0x00, ...new Array(8).fill(0xff)]),
    damageMidway: breakThirdZstdFrame
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

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('decodes a whole file to its end', async () => {
    const result = await decoder.decode(format.compress('numbered-1000'), WHOLE_FILE);

    expect(decode(result.bytes)).toBe(numberedLines(1_000));
    expect(result.reachedEnd).toBe(true);
  });

  it('decodes a whole file larger than one output chunk of its decoder to its end', async () => {
    const result = await decoder.decode(format.compress('random-hex-5000'), {
      isWholeFile: true,
      maxOutputBytes: 16_777_216
    });

    const text = randomHexLines(5_000);
    expect(text.length, 'the sample decodes to more than one 64 KiB output chunk').toBeGreaterThan(65_536);
    expect(decode(result.bytes)).toBe(text);
    expect(result.reachedEnd).toBe(true);
  });

  it('decodes every stream of a file of several to its end, as hashcat does', async () => {
    // Chrome's built-in gzip decoder stops after the first member; hashcat reads them all.
    const result = await decoder.decode(
      concat(format.compress('numbered-40'), format.compress('numbered-80')),
      WHOLE_FILE
    );

    expect(decode(result.bytes)).toBe(numberedLines(40) + numberedLines(80));
    expect(result.reachedEnd).toBe(true);
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

  it('keeps the text but does not claim the end of a file with stray bytes after its last stream', async () => {
    const result = await decoder.decode(concat(format.compress('numbered-10'), encode('junk')), WHOLE_FILE);

    expect(decode(result.bytes)).toBe(numberedLines(10));
    expect(result.reachedEnd).toBe(false);
  });

  it('reports a file broken right after its header as not reaching its end instead of failing', async () => {
    const result = await decoder.decode(format.brokenAfterHeader, WHOLE_FILE);

    expect(result.reachedEnd).toBe(false);
  });

  it('keeps what it decoded before damage further into the file', async () => {
    const damaged = format.damageMidway(format.compress('random-hex-5000'));

    const result = await decoder.decode(damaged, { isWholeFile: true, maxOutputBytes: 16_777_216 });

    const decoded = decode(result.bytes);
    expect(result.reachedEnd).toBe(false);
    expect(decoded.length).toBeGreaterThan(16_384);
    expect(randomHexLines(5_000).startsWith(decoded.slice(0, 16_384))).toBe(true);
  });

  it('decodes an empty stream to nothing, reaching its end', async () => {
    const result = await decoder.decode(format.compress('empty'), WHOLE_FILE);

    expect(result.bytes.length).toBe(0);
    expect(result.reachedEnd).toBe(true);
  });

  it('decodes two files at the same time', async () => {
    const [first, second] = await Promise.all([
      decoder.decode(format.compress('numbered-40'), WHOLE_FILE),
      decoder.decode(format.compress('numbered-80'), WHOLE_FILE)
    ]);

    expect(decode(first.bytes)).toBe(numberedLines(40));
    expect(decode(second.bytes)).toBe(numberedLines(80));
  });

  it('says why when its decoder fails to load, as offline or under a strict CSP', async () => {
    vi.spyOn(WebAssembly, 'instantiate').mockRejectedValueOnce(new Error('blocked'));

    const decoding = decoder.decode(format.compress('numbered-10'), WHOLE_FILE);

    await expect(decoding).rejects.toThrow(
      `Could not decompress the ${format.name} file (loading the ${format.name} decoder failed: Error: blocked).`
    );
  });

  it('does not start decoding once it was cancelled', async () => {
    const controller = new AbortController();
    controller.abort();

    const decoding = decoder.decode(format.compress('numbered-10'), { ...WHOLE_FILE, signal: controller.signal });

    await expect(decoding).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('stops decoding when cancelled before any output arrives', async () => {
    const controller = new AbortController();
    const decoding = decoder.decode(format.compress('a-lines-4194304'), {
      isWholeFile: true,
      maxOutputBytes: 16_777_216,
      signal: controller.signal
    });

    // The decoder is waiting on its first read by the time the call returns, so this cancels it midway.
    controller.abort();

    await expect(decoding).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('stops reading when cancelled once output flows, instead of decoding the rest', async () => {
    const controller = new AbortController();

    // Cancels as the first chunk of output arrives, with most of the sample's 8 MiB still to come.
    const read = ReadableStreamDefaultReader.prototype.read;
    const reads = vi.spyOn(ReadableStreamDefaultReader.prototype, 'read').mockImplementation(function (
      this: ReadableStreamDefaultReader
    ) {
      const result = read.call(this);
      void result.then(({ done }) => done || controller.abort());

      return result;
    });

    const decoding = decoder.decode(format.compress('a-lines-4194304'), {
      isWholeFile: true,
      maxOutputBytes: 16_777_216,
      signal: controller.signal
    });

    await expect(decoding).rejects.toMatchObject({ name: 'AbortError' });
    expect(reads.mock.calls.length).toBeLessThanOrEqual(2);
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

    const result = await decoder.decode(format.compress('numbered-10'), WHOLE_FILE);

    expect(decode(result.bytes)).toBe(numberedLines(10));
  });
});

describe('zstd decoder', () => {
  const zstd = detectCompression(new Uint8Array([0x28, 0xb5, 0x2f, 0xfd]))!;

  it('decodes a file that starts with a skippable frame, as pzstd writes them', async () => {
    const input = concat(new Uint8Array(ZSTD_SKIPPABLE_FRAME), zstdCompressSync(numberedLines(1_000)));

    const result = await zstd.decode(input, WHOLE_FILE);

    expect(decode(result.bytes)).toBe(numberedLines(1_000));
    expect(result.reachedEnd).toBe(true);
  });

  it('decodes a frame that declares a 2 GiB window, the largest the zstd tool writes', async () => {
    // No single segment, no dictionary, no content size; then a window of 2^31 bytes.
    const result = await zstd.decode(rawZstdFrame([0x00, 0xa8], numberedLines(1_000)), WHOLE_FILE);

    expect(decode(result.bytes)).toBe(numberedLines(1_000));
    expect(result.reachedEnd).toBe(true);
  });

  it('refuses a frame declaring a window beyond what its decoder can address, saying why', async () => {
    // No single segment, no dictionary, no content size; then a window of 2^33 bytes.
    const decoding = zstd.decode(rawZstdFrame([0x00, 0xb8], numberedLines(10)), WHOLE_FILE);

    await expect(decoding).rejects.toThrow(
      'Could not decompress the zstd file (decoding needs 8589934592 bytes, which exceeds the memory limit of 4294967295 bytes).'
    );
  });

  it('refuses a file it cannot decode any of, saying why', async () => {
    // A one-byte dictionary id, a 1 KiB window and dictionary 7.
    const decoding = zstd.decode(rawZstdFrame([0x01, 0x00, 0x07], numberedLines(10)), WHOLE_FILE);

    await expect(decoding).rejects.toThrow(
      'Could not decompress the zstd file (unsupported feature: zstd dictionary).'
    );
  });

  it('keeps what it decoded before a frame it cannot decode', async () => {
    const input = concat(zstdFrames(numberedLines(1_000)), rawZstdFrame([0x01, 0x00, 0x07], numberedLines(10)));

    const result = await zstd.decode(input, WHOLE_FILE);

    expect(decode(result.bytes)).toBe(numberedLines(1_000));
    expect(result.reachedEnd).toBe(false);
  });
});

describe('xz decoder', () => {
  const xz = detectCompression(new Uint8Array([0xfd, 0x37, 0x7a, 0x58, 0x5a, 0x00]))!;

  it.each([
    ['a CRC32 check', 'crc32'],
    ['no check', 'check-none'],
    ['a SHA-256 check', 'sha256'],
    ['the x86 filter for executables', 'x86'],
    ['a 96 MiB dictionary', 'dict-96mib']
  ])('decodes a file with %s, as hashcat does', async (unused, variant) => {
    const result = await xz.decode(fixtureFile(`numbered-10.${variant}.txt.xz`), WHOLE_FILE);

    expect(decode(result.bytes)).toBe(numberedLines(10));
    expect(result.reachedEnd).toBe(true);
  });

  it('refuses a file whose filter chain its decoder does not support, saying why', async () => {
    const decoding = xz.decode(fixtureFile('numbered-10.x86-delta.txt.xz'), WHOLE_FILE);

    await expect(decoding).rejects.toThrow(
      'Could not decompress the xz file (unsupported feature: chain of xz filters).'
    );
  });
});
