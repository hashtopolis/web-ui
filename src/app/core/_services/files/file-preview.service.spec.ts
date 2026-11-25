import { gzipSync } from 'node:zlib';

import { firstValueFrom, of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, TestRequest, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { FilePreviewPage } from '@models/file-preview.model';
import { JFile } from '@models/file.model';

import { detectCompression } from '@services/files/file-preview-formats';
import { PreviewSource } from '@services/files/file-preview-source';
import { FilePreviewRequest, FilePreviewService } from '@services/files/file-preview.service';

const encode = (text: string): Uint8Array<ArrayBuffer> => new TextEncoder().encode(text);

const decode = (bytes: Uint8Array): string => new TextDecoder().decode(bytes);

/** Gzips `text` into a plain byte array (a Node `Buffer` slices into a shared pool, not a copy). */
const gzip = (text: string): Uint8Array<ArrayBuffer> => new Uint8Array(gzipSync(text));

/** Text of `count` numbered lines, each terminated by a line feed. */
const numberedLines = (count: number): string =>
  Array.from({ length: count }, (unused, index) => `line${index + 1}\n`).join('');

/** Lines of pseudo-random hex, which gzip can barely shrink, so a little text makes a large file. */
const randomHexLines = (count: number): string => {
  let state = 1;
  const next = (): string => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state.toString(16).padStart(8, '0');
  };

  return Array.from({ length: count }, () => `${next()}${next()}\n`).join('');
};

const storedFile = (overrides: Partial<JFile>): JFile => ({
  id: 1,
  type: 'file',
  filename: 'wordlist.txt',
  size: 0,
  isSecret: false,
  fileType: 0,
  accessGroupId: 1,
  lineCount: 0,
  checksum: null,
  ...overrides
});

describe('FilePreviewService', () => {
  let service: FilePreviewService;
  let httpMock: HttpTestingController;

  const expectRangeRequest = (): TestRequest =>
    httpMock.expectOne((candidate) => candidate.url.endsWith('/helper/getFile'));

  /** Answers the pending range request with the slice of `content` it asked for. */
  const serveRange = (content: Uint8Array): TestRequest => {
    const request = expectRangeRequest();
    const [start, end] = (request.request.headers.get('Range') ?? '').replace('bytes=', '').split('-').map(Number);
    request.flush(content.slice(start, end + 1).buffer as ArrayBuffer);
    return request;
  };

  /**
   * Opens a source on `content` stored as a file, serving the header request and, for a compressed
   * file, the request for its first part.
   *
   * @returns The opened source, and the requests that opening it made.
   */
  const open = async (
    content: Uint8Array,
    overrides: Partial<JFile> = {}
  ): Promise<{ source: PreviewSource; requests: TestRequest[] }> => {
    const opening = firstValueFrom(service.openSource(storedFile({ size: content.length, ...overrides })));

    const requests = [serveRange(content)];
    for (const pending of httpMock.match((candidate) => candidate.url.endsWith('/helper/getFile'))) {
      const [start, end] = (pending.request.headers.get('Range') ?? '').replace('bytes=', '').split('-').map(Number);
      pending.flush(content.slice(start, end + 1).buffer as ArrayBuffer);
      requests.push(pending);
    }

    return { source: await opening, requests };
  };

  /** Reads everything a source holds. */
  const readAll = (source: PreviewSource): Promise<Uint8Array> => firstValueFrom(source.read(0, source.totalBytes - 1));

  /**
   * Loads a page from a source whose window holds `body`, so the line cutting can be checked without
   * any request.
   *
   * @param overrides - Request fields that differ from the defaults, and the size of the content.
   * @param body - Content the window holds.
   */
  const loadPage = (
    overrides: Partial<FilePreviewRequest> & { totalBytes?: number },
    body: string
  ): FilePreviewPage => {
    const bytes = encode(body);
    const { totalBytes = bytes.length, ...request } = overrides;
    const source: PreviewSource = {
      totalBytes,
      reachesEndOfFile: true,
      compression: null,
      read: () => of(bytes),
      windowBytes: () => 1024
    };

    let page!: FilePreviewPage;
    service
      .loadPage(source, { offset: 0, maxLines: 100, windowBytes: 1024, isLineAligned: true, ...request })
      .subscribe((result) => (page = result));

    return page;
  };

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

  describe('opening a file', () => {
    it('reads the first bytes of the file to tell its format', async () => {
      const { requests } = await open(encode('alpha\nbravo\n'), { id: 7 });

      expect(requests.length).toBe(1);
      expect(requests[0].request.params.get('file')).toBe('7');
      expect(requests[0].request.headers.get('Range')).toBe('bytes=0-7');
    });

    it('reads no more header bytes than the file holds', async () => {
      const { requests } = await open(encode('abc'));

      expect(requests[0].request.headers.get('Range')).toBe('bytes=0-2');
    });

    it('opens a plain file as itself, through to its end', async () => {
      const { source } = await open(encode('alpha\nbravo\n'));

      expect(source.totalBytes).toBe(12);
      expect(source.reachesEndOfFile).toBe(true);
      expect(source.compression).toBeNull();
    });

    it('opens an empty file without a request', async () => {
      const source = await firstValueFrom(service.openSource(storedFile({ size: 0 })));

      httpMock.expectNone(() => true);
      expect(source.totalBytes).toBe(0);
      expect(source.reachesEndOfFile).toBe(true);
    });

    it('decompresses a small gzip file whole', async () => {
      const text = numberedLines(1_000);
      const compressed = gzip(text);

      const { source, requests } = await open(compressed);

      expect(requests[1].request.headers.get('Range')).toBe(`bytes=0-${compressed.length - 1}`);
      expect(source.compression).toBe('gzip');
      expect(source.reachesEndOfFile).toBe(true);
      expect(decode(await readAll(source))).toBe(text);
    });

    it('decompresses only the first MiB of a large gzip file, cut back to its last whole line', async () => {
      const text = randomHexLines(200_000);
      const compressed = gzip(text);
      expect(compressed.length, 'the fixture is larger than the peek').toBeGreaterThan(1_048_576);

      const { source, requests } = await open(compressed);

      const preview = decode(await readAll(source));
      expect(requests[1].request.headers.get('Range')).toBe('bytes=0-1048575');
      expect(source.reachesEndOfFile).toBe(false);
      expect(preview.length).toBeGreaterThan(0);
      expect(preview.endsWith('\n')).toBe(true);
      expect(text.startsWith(preview)).toBe(true);
    });

    it('stops decompressing at the output cap, cut back to the last whole line', async () => {
      // Six-byte lines do not line up with a power-of-two cap, so the cap falls inside a line.
      const text = 'abcde\n'.repeat(3_000_000);

      const { source } = await open(gzip(text));

      expect(source.reachesEndOfFile).toBe(false);
      expect(source.totalBytes).toBeLessThan(text.length);
      expect(source.totalBytes % 6).toBe(0);
      expect(decode(await readAll(source)).endsWith('abcde\n')).toBe(true);
    });

    it('fails on a gzip file that decodes to nothing', async () => {
      const damaged = new Uint8Array([0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0xff, 0xff, 0xff]);

      const failure = open(damaged).catch((error: unknown) => error);

      await expect(failure).resolves.toStrictEqual(new Error('Could not decompress the file. It may be damaged.'));
    });

    it('opens a gzip file holding an empty stream as an empty file', async () => {
      const { source } = await open(gzip(''));

      expect(source.totalBytes).toBe(0);
      expect(source.reachesEndOfFile).toBe(true);
    });

    it('sizes the windows of a plain file from its average line length', async () => {
      const { source } = await open(encode('12345678'), { size: 1_000_000, lineCount: 10_000 });

      // 100 bytes a line, 100 lines, 1.4x headroom.
      expect(source.windowBytes(100)).toBe(14_000);
    });

    it('assumes 64 bytes a line for a plain file whose lines were not counted', async () => {
      const { source } = await open(encode('12345678'), { size: 1_000_000, lineCount: 0 });

      expect(source.windowBytes(100)).toBe(8_960);
    });

    it('keeps the windows of a plain file between 4 KiB and 1 MiB', async () => {
      const { source: short } = await open(encode('12345678'), { size: 1_000, lineCount: 100 });
      const { source: long } = await open(encode('12345678'), { size: 100_000_000, lineCount: 1_000 });

      expect(short.windowBytes(100)).toBe(4_096);
      expect(long.windowBytes(100)).toBe(1_048_576);
    });

    it('reads the pages of a compressed file without further requests', async () => {
      const { source } = await open(gzip(numberedLines(1_000)));

      let page!: FilePreviewPage;
      service
        .loadPage(source, { offset: 0, maxLines: 2, windowBytes: source.windowBytes(2), isLineAligned: true })
        .subscribe((result) => (page = result));

      expect(page.lines).toStrictEqual(['line1', 'line2']);
    });

    it('cancels decoding when nothing waits for the source any more, as when the dialog closes', () => {
      const compressed = gzip(numberedLines(1_000));
      const decodeSpy = vi.spyOn(detectCompression(compressed)!, 'decode');

      const subscription = service.openSource(storedFile({ size: compressed.length })).subscribe();
      serveRange(compressed);
      serveRange(compressed);
      subscription.unsubscribe();

      const [, options] = decodeSpy.mock.lastCall!;
      expect(options.signal?.aborted).toBe(true);
    });
  });

  describe('reading a plain file', () => {
    it('requests the asked-for byte window and bypasses the response cache', async () => {
      const { source } = await open(encode('12345678'), { id: 7, size: 10_000 });

      source.read(100, 163).subscribe();

      const request = expectRangeRequest();
      expect(request.request.params.get('file')).toBe('7');
      expect(request.request.headers.get('Range')).toBe('bytes=100-163');
      expect(request.request.headers.get('X-Cache-Skip')).toBe('true');

      request.flush(encode('').buffer);
    });

    it('clamps the requested window to the end of the file', async () => {
      const { source } = await open(encode('12345678'), { size: 100 });

      service.loadPage(source, { offset: 90, maxLines: 10, windowBytes: 1024, isLineAligned: true }).subscribe();

      const request = expectRangeRequest();
      expect(request.request.headers.get('Range')).toBe('bytes=90-99');

      request.flush(encode('').buffer);
    });

    it('rejects a response holding more bytes than the requested range', async () => {
      const { source } = await open(encode('12345678'), { size: 1_000 });

      const failure = firstValueFrom(source.read(10, 17)).catch((error: unknown) => error);
      expectRangeRequest().flush(encode('far too many bytes').buffer);

      await expect(failure).resolves.toStrictEqual(expect.any(Error));
    });

    it('does not request a range for an empty file', async () => {
      const source = await firstValueFrom(service.openSource(storedFile({ size: 0 })));

      let page!: FilePreviewPage;
      service
        .loadPage(source, { offset: 0, maxLines: 10, windowBytes: 1024, isLineAligned: true })
        .subscribe((result) => (page = result));

      httpMock.expectNone(() => true);
      expect(page.lines).toStrictEqual([]);
      expect(page.totalBytes).toBe(0);
    });
  });

  describe('cutting a window into lines', () => {
    it('returns the whole lines of a window and reports where the next page starts', () => {
      const page = loadPage({ totalBytes: 1000 }, 'alpha\nbravo\ncharl');

      expect(page.lines).toStrictEqual(['alpha', 'bravo']);
      expect(page.startByte).toBe(0);
      // The trailing fragment belongs to the next page, so it stops right after "bravo\n".
      expect(page.endByte).toBe(12);
      expect(page.hasPartialLine).toBe(false);
    });

    it('keeps a final line that carries no terminator', () => {
      const page = loadPage({}, 'alpha\nbravo');

      expect(page.lines).toStrictEqual(['alpha', 'bravo']);
      expect(page.endByte).toBe(page.totalBytes);
    });

    it('stops at maxLines even when the window holds more', () => {
      const page = loadPage({ maxLines: 2, totalBytes: 1000 }, 'a\nb\nc\nd\n');

      expect(page.lines).toStrictEqual(['a', 'b']);
      expect(page.endByte).toBe(4);
    });

    it('strips CRLF terminators', () => {
      const page = loadPage({}, 'alpha\r\nbravo\r\n');

      expect(page.lines).toStrictEqual(['alpha', 'bravo']);
    });

    it('drops the leading fragment when the offset was seeked to rather than paged to', () => {
      const page = loadPage({ offset: 500, isLineAligned: false, totalBytes: 1000 }, 'avo\ncharlie\ndelt');

      expect(page.lines).toStrictEqual(['charlie']);
      // "avo\n" is the tail of a line that started before the window.
      expect(page.startByte).toBe(504);
      expect(page.endByte).toBe(512);
    });

    it('flags a window that holds no complete line', () => {
      const page = loadPage({ totalBytes: 100_000 }, 'a-line-longer-than-the-window');

      expect(page.hasPartialLine).toBe(true);
      expect(page.lines).toStrictEqual(['a-line-longer-than-the-window']);
      // The whole window is consumed, so paging on makes progress instead of re-reading it.
      expect(page.endByte).toBe(29);
    });

    it('flags windows holding NUL bytes as binary', () => {
      const page = loadPage({}, 'PK\u0000\u0000archive\n');

      expect(page.isBinary).toBe(true);
    });

    describe('when filling a page from the end of the window', () => {
      it('returns the last lines, not the first ones in the window', () => {
        const page = loadPage({ offset: 0, takeLastLines: true, maxLines: 2 }, 'alpha\nbravo\ncharlie\ndelta\n');

        expect(page.lines).toStrictEqual(['charlie', 'delta']);
        expect(page.startByte).toBe(12);
        expect(page.endByte).toBe(page.totalBytes);
      });

      it('keeps a final line that carries no terminator', () => {
        const page = loadPage({ offset: 0, takeLastLines: true, maxLines: 2 }, 'alpha\nbravo\ncharlie');

        expect(page.lines).toStrictEqual(['bravo', 'charlie']);
      });

      it('returns every line when the window holds fewer than a page of them', () => {
        const page = loadPage({ offset: 0, takeLastLines: true, maxLines: 10 }, 'alpha\nbravo\n');

        expect(page.lines).toStrictEqual(['alpha', 'bravo']);
        expect(page.startByte).toBe(0);
      });

      it('drops the leading fragment of a window that starts mid-line', () => {
        const page = loadPage(
          { offset: 500, takeLastLines: true, maxLines: 10, totalBytes: 518 },
          'avo\ncharlie\ndelta\n'
        );

        expect(page.lines).toStrictEqual(['charlie', 'delta']);
        expect(page.startByte).toBe(504);
      });
    });
  });
});
