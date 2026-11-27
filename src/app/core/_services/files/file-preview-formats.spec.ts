import { gzipSync } from 'node:zlib';

import { detectCompression } from '@services/files/file-preview-formats';

/** Text of `count` numbered lines, each terminated by a line feed. */
const numberedLines = (count: number): string =>
  Array.from({ length: count }, (unused, index) => `line${index + 1}\n`).join('');

const encode = (text: string): Uint8Array => new TextEncoder().encode(text);

const decode = (bytes: Uint8Array): string => new TextDecoder().decode(bytes);

describe('detectCompression', () => {
  it('recognises a gzip header', () => {
    const format = detectCompression(new Uint8Array([0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00]));

    expect(format?.name).toBe('gzip');
  });

  it('treats plain text as uncompressed', () => {
    expect(detectCompression(encode('password'))).toBeNull();
  });

  it('requires the deflate method byte after the gzip magic, as hashcat does', () => {
    expect(detectCompression(new Uint8Array([0x1f, 0x8b, 0x00, 0x00]))).toBeNull();
  });

  it('treats a file shorter than the gzip header as uncompressed', () => {
    expect(detectCompression(new Uint8Array([0x1f, 0x8b]))).toBeNull();
  });
});

describe('gzip decoder', () => {
  const gzip = detectCompression(new Uint8Array([0x1f, 0x8b, 0x08]))!;

  it('decodes a whole file to its end', async () => {
    const text = numberedLines(1_000);

    const result = await gzip.decode(gzipSync(text), { isWholeFile: true, maxOutputBytes: 1_048_576 });

    expect(decode(result.bytes)).toBe(text);
    expect(result.reachedEnd).toBe(true);
  });

  it('decodes a whole file that spans many input slices to its end', async () => {
    const text = numberedLines(50_000);
    const compressed = gzipSync(text);

    const result = await gzip.decode(compressed, { isWholeFile: true, maxOutputBytes: 16_777_216 });

    expect(compressed.length, 'the fixture spans several 16 KiB slices').toBeGreaterThan(65_536);
    expect(decode(result.bytes)).toBe(text);
    expect(result.reachedEnd).toBe(true);
  });

  it('never claims the end of a multi-member file while showing only part of it', async () => {
    // Browsers differ here: Chrome stops after the first member, Node decodes them all. Either is
    // fine as long as a partial result is not passed off as the whole file.
    const first = numberedLines(40);
    const second = numberedLines(80);

    const result = await gzip.decode(new Uint8Array([...gzipSync(first), ...gzipSync(second)]), {
      isWholeFile: true,
      maxOutputBytes: 1_048_576
    });

    const decoded = decode(result.bytes);
    expect(decoded.length).toBeGreaterThan(0);
    expect((first + second).startsWith(decoded)).toBe(true);
    expect(result.reachedEnd).toBe(decoded === first + second);
  });

  it('decodes what a cut-off prefix holds without failing', async () => {
    const text = numberedLines(50_000);
    const compressed = gzipSync(text);

    const result = await gzip.decode(compressed.subarray(0, compressed.length >> 1), {
      isWholeFile: false,
      maxOutputBytes: 16_777_216
    });

    expect(result.bytes.length).toBeGreaterThan(0);
    expect(result.bytes.length).toBeLessThan(text.length);
    expect(text.startsWith(decode(result.bytes))).toBe(true);
    expect(result.reachedEnd).toBe(false);
  });

  it('stops at the output cap', async () => {
    const compressed = gzipSync('a\n'.repeat(4_194_304));

    const result = await gzip.decode(compressed, { isWholeFile: true, maxOutputBytes: 65_536 });

    expect(result.bytes.length).toBe(65_536);
    expect(decode(result.bytes)).toBe('a\n'.repeat(32_768));
    expect(result.reachedEnd).toBe(false);
  });

  it('reaches the end of a file whose output exactly fills the cap', async () => {
    const result = await gzip.decode(gzipSync('a\n'.repeat(32_768)), { isWholeFile: true, maxOutputBytes: 65_536 });

    expect(result.bytes.length).toBe(65_536);
    expect(result.reachedEnd).toBe(true);
  });

  it('does not claim the end of a file it was only given the start of', async () => {
    // The prefix happens to hold a complete stream, but the file goes on after it.
    const result = await gzip.decode(gzipSync(numberedLines(10)), { isWholeFile: false, maxOutputBytes: 1_048_576 });

    expect(decode(result.bytes)).toBe(numberedLines(10));
    expect(result.reachedEnd).toBe(false);
  });

  it('reports a damaged file as not reaching its end instead of failing', async () => {
    const damaged = new Uint8Array([
      0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0xff, 0xff, 0xff, 0xff
    ]);

    const result = await gzip.decode(damaged, { isWholeFile: true, maxOutputBytes: 1_048_576 });

    expect(result.reachedEnd).toBe(false);
  });

  it('decodes an empty stream to nothing, reaching its end', async () => {
    const result = await gzip.decode(gzipSync(''), { isWholeFile: true, maxOutputBytes: 1_048_576 });

    expect(result.bytes.length).toBe(0);
    expect(result.reachedEnd).toBe(true);
  });

  it('does not start decoding once it was cancelled', async () => {
    const controller = new AbortController();
    controller.abort();

    const decoding = gzip.decode(gzipSync(numberedLines(10)), {
      isWholeFile: true,
      maxOutputBytes: 1_048_576,
      signal: controller.signal
    });

    await expect(decoding).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('stops decoding when cancelled while it runs', async () => {
    const controller = new AbortController();
    const decoding = gzip.decode(gzipSync('a\n'.repeat(4_194_304)), {
      isWholeFile: true,
      maxOutputBytes: 16_777_216,
      signal: controller.signal
    });

    // The decoder is waiting on its first read by the time the call returns, so this cancels it midway.
    controller.abort();

    await expect(decoding).rejects.toMatchObject({ name: 'AbortError' });
  });
});
