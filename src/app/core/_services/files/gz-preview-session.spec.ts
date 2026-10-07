import { firstValueFrom } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { FilePreviewPage } from '@models/file-preview.model';

import { FilePreviewService } from '@services/files/file-preview.service';
import { GzPreviewSession } from '@services/files/gz-preview-session';

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

describe('GzPreviewSession', () => {
  let service: FilePreviewService;
  let httpMock: HttpTestingController;

  /** A reading session on a file of `totalBytes` compressed bytes. */
  const openSession = (totalBytes: number): GzPreviewSession => service.openGzSession(1, totalBytes);

  /**
   * Answers the pending range request with the slice of `compressed` it asked for, the way the
   * backend's range endpoint would, and reports the range it asked for.
   */
  const serveRange = (compressed: Uint8Array): string => {
    const request = httpMock.expectOne((candidate) => candidate.url.endsWith('/helper/getFile'));
    const range = request.request.headers.get('Range') ?? '';
    const [start, end] = range.replace('bytes=', '').split('-').map(Number);
    request.flush(compressed.slice(start, end + 1).buffer as ArrayBuffer);
    return range;
  };

  /** Lets the session's asynchronous decompression run on to its next request or result. */
  const settle = async (): Promise<void> => {
    for (let i = 0; i < 5; i++) {
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    }
  };

  /** Loads one page and waits for it, assuming the session needs no more than the served ranges. */
  const loadPage = async (
    session: GzPreviewSession,
    overrides: { offset?: number; maxLines?: number } = {}
  ): Promise<FilePreviewPage> => firstValueFrom(session.loadPage({ offset: 0, maxLines: 10, ...overrides }));

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
    const session = openSession(compressed.length);
    const pagePromise = loadPage(session, { maxLines: 2 });

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

  it('bypasses the response cache with its range requests', async () => {
    const compressed = await gz('alpha\n');
    const session = openSession(compressed.length);
    const pagePromise = loadPage(session, { maxLines: 1 });

    const request = httpMock.expectOne((candidate) => candidate.url.endsWith('/helper/getFile'));
    expect(request.request.params.get('file')).toBe('1');
    expect(request.request.headers.get('Range')).toBe(`bytes=0-${compressed.length - 1}`);
    expect(request.request.headers.get('X-Cache-Skip')).toBe('true');
    request.flush(compressed.buffer as ArrayBuffer);

    await pagePromise;
  });

  it('grows the window with a continuation range when the first one comes up short', async () => {
    const lines = randomLines(120, 1500);
    const compressed = await gz(`${lines.join('\n')}\n`);
    const session = openSession(compressed.length);
    const pagePromise = loadPage(session, { maxLines: 100 });

    // The first window covers only part of the compressed file...
    expect(serveRange(compressed)).toBe('bytes=0-65535');
    await settle();
    // ...so the next request fetches the continuation of the cached prefix, not the prefix again.
    expect(serveRange(compressed)).toBe(`bytes=65536-${compressed.length - 1}`);
    const page = await pagePromise;

    expect(page.lines).toEqual(lines.slice(0, 100));
    expect(page.compressedBytesFetched).toBe(compressed.length);
    expect(page.hasMore).toBeTrue();
  });

  it('cuts later pages from the cached prefix without fetching again', async () => {
    const compressed = await gz('alpha\nbravo\ncharlie\ndelta\n');
    const session = openSession(compressed.length);

    const firstPromise = loadPage(session, { maxLines: 2 });
    serveRange(compressed);
    const first = await firstPromise;

    const secondPromise = loadPage(session, { offset: first.endByte, maxLines: 2 });
    await settle();
    // The whole compressed file is cached after the first window, so paging needs no new request.
    httpMock.expectNone((candidate) => candidate.url.endsWith('/helper/getFile'));
    const second = await secondPromise;

    expect(second.lines).toEqual(['charlie', 'delta']);
    expect(second.startByte).toBe(first.endByte);
    expect(second.hasMore).toBeFalse();
  });

  it('treats a window cut mid-stream as the end of its decompressed output', async () => {
    const lines = randomLines(100, 1000);
    const compressed = await gz(`${lines.join('\n')}\n`);
    const session = openSession(compressed.length);
    const pagePromise = loadPage(session, { maxLines: 50 });

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
    const session = openSession(compressed.length);
    const pagePromise = loadPage(session, { maxLines: 100 });

    serveRange(compressed);
    const page = await pagePromise;

    expect(page.lines.length).toBeGreaterThan(0);
    expect(page.lines[0]).toBe('alpha');
    expect(page.hasDecompressionError).toBeTrue();
    expect(page.hasMore).toBeFalse();
  });

  it('refuses a file whose bytes are not a gzip stream', async () => {
    const plain = new TextEncoder().encode('not actually compressed\n');
    const session = openSession(plain.length);
    const pagePromise = loadPage(session);

    serveRange(plain);

    const error = await pagePromise.catch((failure: unknown) => failure);
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe('The file does not hold gzip-compressed data.');
  });

  it('previews only the first member of a multi-member gzip file', async () => {
    const compressed = concat([await gz('alpha\nbravo\n'), await gz('charlie\ndelta\n')]);
    const session = openSession(compressed.length);
    const pagePromise = loadPage(session);

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
    const session = openSession(compressed.length);
    const pagePromise = loadPage(session);

    serveRange(compressed);
    const page = await pagePromise;

    expect(page.lines).toEqual(['text\u0000with a nul']);
    expect(page.isBinary).toBeTrue();
  });

  it('keeps a trailing line that carries no terminator once the whole file is fetched', async () => {
    const compressed = await gz('alpha\nbravo');
    const session = openSession(compressed.length);
    const pagePromise = loadPage(session);

    serveRange(compressed);
    const page = await pagePromise;

    expect(page.lines).toEqual(['alpha', 'bravo']);
    // "alpha\nbravo" is eleven decompressed bytes, and the page consumes all of them.
    expect(page.endByte).toBe(11);
    expect(page.hasMore).toBeFalse();
  });

  it('reads no range for an empty file', async () => {
    const session = openSession(0);
    const page = await loadPage(session);

    httpMock.expectNone((candidate) => candidate.url.endsWith('/helper/getFile'));
    expect(page.lines).toEqual([]);
    expect(page.hasMore).toBeFalse();
  });
});
