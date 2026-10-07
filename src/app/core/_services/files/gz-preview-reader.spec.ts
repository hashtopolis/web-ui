import { firstValueFrom } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { GzPreviewPage } from '@models/file-preview.model';
import { JFile } from '@models/file.model';

import { FilePreviewService } from '@services/files/file-preview.service';
import { GzPreviewReader } from '@services/files/gz-preview-reader';

/** A gzip-compressed file; its `size` is set per test to the length of the compressed fixture. */
const GZ_FILE: JFile = {
  id: 1,
  type: 'file',
  filename: 'wordlist.txt.gz',
  size: 0,
  isSecret: false,
  fileType: 0,
  accessGroupId: 1,
  lineCount: 0
};

/** Status the backend answers every honoured range request with. */
const PARTIAL_CONTENT = { status: 206, statusText: 'Partial Content' };

/** Concatenates byte chunks into a single array. */
const concat = (chunks: Uint8Array[]): Uint8Array => {
  const output = new Uint8Array(chunks.reduce((length, chunk) => length + chunk.length, 0));
  let position = 0;
  for (const chunk of chunks) {
    output.set(chunk, position);
    position += chunk.length;
  }
  return output;
};

/** Compresses text the way the backend stores a `.gz` file, using the browser's own encoder. */
const gz = async (text: string): Promise<Uint8Array> => {
  const reader = new Blob([text]).stream().pipeThrough(new CompressionStream('gzip')).getReader();
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
  }
  return concat(chunks);
};

/**
 * Measures how many decompressed bytes the browser's gzip decoder hands out per chunk, which is
 * what a fixture has to know to place a line terminator exactly on a chunk boundary.
 */
const decompressionChunkBytes = async (): Promise<number> => {
  const reader = new Blob([(await gz('x'.repeat(500_000))).buffer as ArrayBuffer])
    .stream()
    .pipeThrough(new DecompressionStream('gzip'))
    .getReader();
  const { value } = await reader.read();
  await reader.cancel();
  return value?.length ?? 0;
};

/**
 * Builds poorly compressible lines, so a fixture really spans several fetch windows rather than
 * collapsing into a handful of compressed bytes.
 *
 * @param count - How many lines to build.
 * @param lineBytes - How many bytes of random printable characters each line holds.
 * @returns The lines, none of which carries a line terminator.
 */
const randomLines = (count: number, lineBytes: number): string[] =>
  Array.from({ length: count }, () => {
    const bytes = new Uint8Array(lineBytes);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = 33 + Math.floor(Math.random() * 90);
    }
    return new TextDecoder().decode(bytes);
  });

describe('GzPreviewReader', () => {
  let service: FilePreviewService;
  let httpMock: HttpTestingController;

  /** A reader on a file of `totalBytes` compressed bytes. */
  const openReader = (totalBytes: number): GzPreviewReader =>
    service.openReader({ ...GZ_FILE, size: totalBytes }) as GzPreviewReader;

  /**
   * Answers the pending range request with the slice of `compressed` it asked for, the way the
   * backend's range endpoint would, and reports the range it asked for.
   */
  const serveRange = (compressed: Uint8Array): string => {
    const request = httpMock.expectOne((candidate) => candidate.url.endsWith('/helper/getFile'));
    const range = request.request.headers.get('Range') ?? '';
    const [start, end] = range.replace('bytes=', '').split('-').map(Number);
    request.flush(compressed.slice(start, end + 1).buffer as ArrayBuffer, PARTIAL_CONTENT);
    return range;
  };

  /**
   * Waits for the session's next range request and answers it, however long the decompression in
   * between keeps it busy.
   */
  const serveNextRange = async (compressed: Uint8Array): Promise<string> => {
    for (let attempt = 0; attempt < 250; attempt++) {
      const [request] = httpMock.match((candidate) => candidate.url.endsWith('/helper/getFile'));
      if (request) {
        const range = request.request.headers.get('Range') ?? '';
        const [start, end] = range.replace('bytes=', '').split('-').map(Number);
        request.flush(compressed.slice(start, end + 1).buffer as ArrayBuffer, PARTIAL_CONTENT);
        return range;
      }
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    }
    throw new Error('The session did not ask for the next range in time.');
  };

  /** Lets the session's asynchronous decompression run on to its next request or result. */
  const settle = async (): Promise<void> => {
    for (let i = 0; i < 5; i++) {
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    }
  };

  /** Reads one page and waits for it, assuming the reader needs no more than the served ranges. */
  const readForward = async (
    reader: GzPreviewReader,
    { offset = 0, maxLines = 10 }: { offset?: number; maxLines?: number } = {}
  ): Promise<GzPreviewPage> => firstValueFrom(reader.readForward(offset, maxLines));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilePreviewService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(FilePreviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches the compressed file from its first byte and decompresses whole lines', async () => {
    const compressed = await gz('alpha\nbravo\ncharlie\ndelta\n');
    const reader = openReader(compressed.length);
    const pagePromise = readForward(reader, { maxLines: 2 });

    // A file smaller than one fetch window is requested in a single range covering it whole.
    expect(serveRange(compressed)).toBe(`bytes=0-${compressed.length - 1}`);
    const page = await pagePromise;

    expect(page.lines).toEqual(['alpha', 'bravo']);
    expect(page.startByte).toBe(0);
    // The trailing "charlie\ndelta\n" belongs to later pages, so the page stops after "bravo\n".
    expect(page.endByte).toBe(12);
    expect(page.hasMore).toBeTrue();
    expect(page.compressedBytesFetched).toBe(compressed.length);
    expect(page.hasDecompressionError).toBeFalse();
  });

  it('tags its pages as gzip pages that carry the compressed size of the file', async () => {
    const compressed = await gz('alpha\n');
    const reader = openReader(compressed.length);
    const pagePromise = readForward(reader);

    serveRange(compressed);
    const page = await pagePromise;

    expect(page.kind).toBe('gzip');
    expect(page.compressedTotalBytes).toBe(compressed.length);
  });

  it('continues after a page at the decompressed offset where that page ended', async () => {
    const compressed = await gz('alpha\nbravo\ncharlie\ndelta\n');
    const reader = openReader(compressed.length);
    const firstPromise = readForward(reader, { maxLines: 2 });
    serveRange(compressed);
    const first = await firstPromise;

    const next = await firstValueFrom(reader.readNext(first, 2));

    expect(next.startByte).toBe(first.endByte);
    expect(next.lines).toEqual(['charlie', 'delta']);
  });

  it('bypasses the response cache with its range requests', async () => {
    const compressed = await gz('alpha\n');
    const reader = openReader(compressed.length);
    const pagePromise = readForward(reader, { maxLines: 1 });

    const request = httpMock.expectOne((candidate) => candidate.url.endsWith('/helper/getFile'));
    expect(request.request.params.get('file')).toBe('1');
    expect(request.request.headers.get('Range')).toBe(`bytes=0-${compressed.length - 1}`);
    expect(request.request.headers.get('X-Cache-Skip')).toBe('true');
    request.flush(compressed.buffer as ArrayBuffer, PARTIAL_CONTENT);

    await pagePromise;
  });

  it('grows the window with a continuation range when the first one comes up short', async () => {
    const lines = randomLines(120, 1500);
    const compressed = await gz(`${lines.join('\n')}\n`);
    const reader = openReader(compressed.length);
    const pagePromise = readForward(reader, { maxLines: 100 });

    // The first window covers only part of the compressed file...
    expect(await serveNextRange(compressed)).toBe('bytes=0-65535');
    // ...so the next request fetches the continuation of the cached prefix, not the prefix again.
    expect(await serveNextRange(compressed)).toBe(`bytes=65536-${compressed.length - 1}`);
    const page = await pagePromise;

    expect(page.lines).toEqual(lines.slice(0, 100));
    expect(page.compressedBytesFetched).toBe(compressed.length);
    expect(page.hasMore).toBeTrue();
  });

  it('stops at the compressed fetch limit and says so, instead of running out silently', async () => {
    // Lines of random bytes barely compress, so these leave well over 4 MiB of compressed data.
    const lines = randomLines(3_800, 1_500);
    const compressed = await gz(`${lines.join('\n')}\n`);
    expect(compressed.length).toBeGreaterThan(4_194_304);
    const reader = openReader(compressed.length);

    // A page deep in the file that 4 MiB of compressed data cannot fill: it starts inside what that
    // much decompresses to, and asks for far more lines than remain there.
    const firstLine = 3_000;
    const pagePromise = readForward(reader, { offset: firstLine * 1_501, maxLines: 1_000 });

    expect(await serveNextRange(compressed)).toBe('bytes=0-65535');
    expect(await serveNextRange(compressed)).toBe('bytes=65536-262143');
    expect(await serveNextRange(compressed)).toBe('bytes=262144-1048575');
    expect(await serveNextRange(compressed)).toBe('bytes=1048576-4194303');
    const page = await pagePromise;

    expect(page.lines.length).toBeGreaterThan(0);
    expect(page.lines).toEqual(lines.slice(firstLine, firstLine + page.lines.length));
    expect(page.reachedFetchLimit).toBeTrue();
    expect(page.hasMore).toBeFalse();
    // The cut-off tail is not a long line, so it is not reported as one.
    expect(page.hasPartialLine).toBeFalse();
    expect(page.compressedBytesFetched).toBe(4_194_304);
  });

  it('cuts later pages from the cached prefix without fetching again', async () => {
    const compressed = await gz('alpha\nbravo\ncharlie\ndelta\n');
    const reader = openReader(compressed.length);

    const firstPromise = readForward(reader, { maxLines: 2 });
    serveRange(compressed);
    const first = await firstPromise;

    const secondPromise = readForward(reader, { offset: first.endByte, maxLines: 2 });
    await settle();
    // The whole compressed file is cached after the first window, so paging needs no new request.
    httpMock.expectNone((candidate) => candidate.url.endsWith('/helper/getFile'));
    const second = await secondPromise;

    expect(second.lines).toEqual(['charlie', 'delta']);
    expect(second.startByte).toBe(first.endByte);
    expect(second.hasMore).toBeFalse();
  });

  it('keeps paging when a page ends exactly where a decompression chunk ends', async () => {
    // The decoder is stopped early once a page has enough lines. If that happens to be at the end of
    // an output chunk, the output so far must not be mistaken for the end of the file.
    const chunkBytes = await decompressionChunkBytes();
    const lineBytes = Math.floor(chunkBytes / 100);
    const lines = Array.from({ length: 99 }, (unused, i) => String(i).padEnd(lineBytes - 1, 'a'));
    lines.push('z'.repeat(chunkBytes - 99 * lineBytes - 1));
    for (let i = 100; i < 500; i++) {
      lines.push(`line${i}`);
    }
    const compressed = await gz(`${lines.join('\n')}\n`);
    const reader = openReader(compressed.length);
    const pagePromise = readForward(reader, { maxLines: 100 });

    serveRange(compressed);
    const page = await pagePromise;

    expect(page.lines.length).toBe(100);
    expect(page.endByte).toBe(chunkBytes);
    expect(page.hasMore).toBeTrue();
  });

  it('treats a window cut mid-stream as the end of its decompressed output', async () => {
    const lines = randomLines(100, 1000);
    const compressed = await gz(`${lines.join('\n')}\n`);
    const reader = openReader(compressed.length);
    const pagePromise = readForward(reader, { maxLines: 50 });

    // The window has to cut the gzip stream mid-block, which ends decompression abruptly.
    expect(serveRange(compressed)).toBe('bytes=0-65535');
    const page = await pagePromise;

    // Still, the first window already holds fifty whole lines, so nothing more is fetched and the
    // abrupt end is not mistaken for a damaged file.
    expect(page.lines).toEqual(lines.slice(0, 50));
    expect(page.hasMore).toBeTrue();
    expect(page.hasDecompressionError).toBeFalse();
  });

  it('reports a warning when a fetched-whole file cannot be decompressed in full', async () => {
    // Cutting bytes off the stored file damages its stream: what decodes is a valid prefix, but the
    // decoder can never reach a clean end of stream.
    const compressed = (await gz('alpha\n'.repeat(50))).slice(0, -6);
    const reader = openReader(compressed.length);
    const pagePromise = readForward(reader, { maxLines: 100 });

    serveRange(compressed);
    const page = await pagePromise;

    expect(page.lines.length).toBeGreaterThan(0);
    expect(page.lines[0]).toBe('alpha');
    expect(page.hasDecompressionError).toBeTrue();
    expect(page.hasMore).toBeFalse();
  });

  it('refuses a file whose bytes are not a gzip stream', async () => {
    const plain = new TextEncoder().encode('not actually compressed\n');
    const reader = openReader(plain.length);
    const pagePromise = readForward(reader);

    serveRange(plain);

    const error = await pagePromise.catch((failure: unknown) => failure);
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe('The file does not hold gzip-compressed data.');
  });

  it('previews only the first member of a multi-member gzip file', async () => {
    const compressed = concat([await gz('alpha\nbravo\n'), await gz('charlie\ndelta\n')]);
    const reader = openReader(compressed.length);
    const pagePromise = readForward(reader);

    serveRange(compressed);
    const page = await pagePromise;

    // The browser's gzip decoder handles a single member and treats what follows as junk, so a
    // concatenated file previews its first member and reports that decompression ended early.
    expect(page.lines).toEqual(['alpha', 'bravo']);
    expect(page.hasMore).toBeFalse();
    expect(page.hasDecompressionError).toBeTrue();
  });

  it('flags decompressed content that holds NUL bytes', async () => {
    const compressed = await gz('text\u0000with a nul\n');
    const reader = openReader(compressed.length);
    const pagePromise = readForward(reader);

    serveRange(compressed);
    const page = await pagePromise;

    expect(page.lines).toEqual(['text\u0000with a nul']);
    expect(page.isBinary).toBeTrue();
  });

  it('keeps a trailing line that carries no terminator once the whole file is fetched', async () => {
    const compressed = await gz('alpha\nbravo');
    const reader = openReader(compressed.length);
    const pagePromise = readForward(reader);

    serveRange(compressed);
    const page = await pagePromise;

    expect(page.lines).toEqual(['alpha', 'bravo']);
    // "alpha\nbravo" is eleven decompressed bytes, and the page consumes all of them.
    expect(page.endByte).toBe(11);
    expect(page.hasMore).toBeFalse();
  });

  it('reads no range for an empty file', async () => {
    const reader = openReader(0);
    const page = await readForward(reader);

    httpMock.expectNone((candidate) => candidate.url.endsWith('/helper/getFile'));
    expect(page.lines).toEqual([]);
    expect(page.hasMore).toBeFalse();
  });
});
