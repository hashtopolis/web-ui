import { firstValueFrom } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, TestRequest, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PlainPreviewPage } from '@models/file-preview.model';
import { JFile } from '@models/file.model';

import { FilePreviewRequest, FilePreviewService } from '@services/files/file-preview.service';

const FILE: JFile = {
  id: 3,
  type: 'file',
  filename: 'wordlist.txt',
  size: 10_000,
  isSecret: false,
  fileType: 0,
  accessGroupId: 1,
  lineCount: 1_000
};

/** Status the backend answers every honoured range request with. */
const PARTIAL_CONTENT = { status: 206, statusText: 'Partial Content' };

describe('FilePreviewService', () => {
  let service: FilePreviewService;
  let httpMock: HttpTestingController;

  /** Encodes the bytes a mocked range response should return. */
  const encode = (text: string): ArrayBuffer => new TextEncoder().encode(text).buffer as ArrayBuffer;

  /** The one pending range request. */
  const expectRangeRequest = (): TestRequest =>
    httpMock.expectOne((candidate) => candidate.url.endsWith('/helper/getFile'));

  /**
   * Issues a page request and answers it with `body`, as the backend's range response would.
   *
   * @param overrides - Request fields that differ from the defaults.
   * @param body - Content the mocked window returns.
   */
  const loadPage = (overrides: Partial<FilePreviewRequest>, body: string): PlainPreviewPage => {
    const request: FilePreviewRequest = {
      fileId: 1,
      offset: 0,
      maxLines: 100,
      windowBytes: 1024,
      totalBytes: encode(body).byteLength,
      isLineAligned: true,
      ...overrides
    };

    let page!: PlainPreviewPage;
    service.loadPage(request).subscribe((result) => (page = result));

    expectRangeRequest().flush(encode(body), PARTIAL_CONTENT);

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

  it('requests the asked-for byte window and bypasses the response cache', () => {
    service
      .loadPage({
        fileId: 7,
        offset: 100,
        maxLines: 10,
        windowBytes: 64,
        totalBytes: 10_000,
        isLineAligned: true
      })
      .subscribe();

    const request = expectRangeRequest();
    expect(request.request.params.get('file')).toBe('7');
    expect(request.request.headers.get('Range')).toBe('bytes=100-163');
    expect(request.request.headers.get('X-Cache-Skip')).toBe('true');

    request.flush(encode(''), PARTIAL_CONTENT);
  });

  it('clamps the requested window to the end of the file', () => {
    service
      .loadPage({ fileId: 1, offset: 90, maxLines: 10, windowBytes: 1024, totalBytes: 100, isLineAligned: true })
      .subscribe();

    const request = expectRangeRequest();
    expect(request.request.headers.get('Range')).toBe('bytes=90-99');

    request.flush(encode(''), PARTIAL_CONTENT);
  });

  it('returns the whole lines of a window and reports where the next page starts', () => {
    const page = loadPage({ totalBytes: 1000 }, 'alpha\nbravo\ncharl');

    expect(page.kind).toBe('plain');
    expect(page.lines).toEqual(['alpha', 'bravo']);
    expect(page.startByte).toBe(0);
    // The trailing fragment belongs to the next page, so it stops right after "bravo\n".
    expect(page.endByte).toBe(12);
    expect(page.hasPartialLine).toBeFalse();
    expect(page.hasMore).toBeTrue();
  });

  it('keeps a final line that carries no terminator', () => {
    const page = loadPage({}, 'alpha\nbravo');

    expect(page.lines).toEqual(['alpha', 'bravo']);
    expect(page.endByte).toBe(page.totalBytes);
    expect(page.hasMore).toBeFalse();
  });

  it('stops at maxLines even when the window holds more', () => {
    const page = loadPage({ maxLines: 2, totalBytes: 1000 }, 'a\nb\nc\nd\n');

    expect(page.lines).toEqual(['a', 'b']);
    expect(page.endByte).toBe(4);
  });

  it('strips CRLF terminators', () => {
    const page = loadPage({}, 'alpha\r\nbravo\r\n');

    expect(page.lines).toEqual(['alpha', 'bravo']);
  });

  it('drops the leading fragment when the offset was seeked to rather than paged to', () => {
    const page = loadPage({ offset: 500, isLineAligned: false, totalBytes: 1000 }, 'avo\ncharlie\ndelt');

    expect(page.lines).toEqual(['charlie']);
    // "avo\n" is the tail of a line that started before the window.
    expect(page.startByte).toBe(504);
    expect(page.endByte).toBe(512);
  });

  it('flags a window that holds no complete line', () => {
    const page = loadPage({ totalBytes: 100_000 }, 'a-line-longer-than-the-window');

    expect(page.hasPartialLine).toBeTrue();
    expect(page.lines).toEqual(['a-line-longer-than-the-window']);
    // The whole window is consumed, so paging on makes progress instead of re-reading it.
    expect(page.endByte).toBe(29);
  });

  it('flags windows holding NUL bytes as binary', () => {
    const page = loadPage({}, 'PK\u0000\u0000archive\n');

    expect(page.isBinary).toBeTrue();
  });

  describe('when filling a page from the end of the window', () => {
    it('returns the last lines, not the first ones in the window', () => {
      const page = loadPage({ offset: 0, takeLastLines: true, maxLines: 2 }, 'alpha\nbravo\ncharlie\ndelta\n');

      expect(page.lines).toEqual(['charlie', 'delta']);
      expect(page.startByte).toBe(12);
      expect(page.endByte).toBe(page.totalBytes);
    });

    it('keeps a final line that carries no terminator', () => {
      const page = loadPage({ offset: 0, takeLastLines: true, maxLines: 2 }, 'alpha\nbravo\ncharlie');

      expect(page.lines).toEqual(['bravo', 'charlie']);
    });

    it('returns every line when the window holds fewer than a page of them', () => {
      const page = loadPage({ offset: 0, takeLastLines: true, maxLines: 10 }, 'alpha\nbravo\n');

      expect(page.lines).toEqual(['alpha', 'bravo']);
      expect(page.startByte).toBe(0);
    });

    it('drops the leading fragment of a window that starts mid-line', () => {
      const page = loadPage(
        { offset: 500, takeLastLines: true, maxLines: 10, totalBytes: 518 },
        'avo\ncharlie\ndelta\n'
      );

      expect(page.lines).toEqual(['charlie', 'delta']);
      expect(page.startByte).toBe(504);
    });
  });

  it('rejects a response holding more bytes than the requested range', async () => {
    const failure = firstValueFrom(
      service.loadPage({
        fileId: 1,
        offset: 10,
        maxLines: 10,
        windowBytes: 8,
        totalBytes: 1000,
        isLineAligned: true
      })
    ).catch((error: unknown) => error);

    expectRangeRequest().flush(encode('far too many bytes'), PARTIAL_CONTENT);

    await expectAsync(failure).toBeResolvedTo(jasmine.any(Error));
  });

  describe('fetchRange', () => {
    it('asks for exactly the given byte range and hands back the bytes', async () => {
      const bytes = firstValueFrom(service.fetchRange(7, 100, 163));

      const request = expectRangeRequest();
      expect(request.request.params.get('file')).toBe('7');
      expect(request.request.headers.get('Range')).toBe('bytes=100-163');
      expect(request.request.headers.get('X-Cache-Skip')).toBe('true');
      request.flush(encode('alpha'), PARTIAL_CONTENT);

      expect(Array.from(await bytes)).toEqual(Array.from(new TextEncoder().encode('alpha')));
    });

    it('refuses an answer that is not partial content, since the server then ignored the range', async () => {
      const failure = firstValueFrom(service.fetchRange(1, 0, 7)).catch((error: unknown) => error);

      // A 200 means the whole representation is on its way, however many bytes it turns out to be.
      expectRangeRequest().flush(encode('whole fi'));

      const error = await failure;
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('The server ignored the requested byte range.');
    });

    it('refuses more bytes than the range covers', async () => {
      const failure = firstValueFrom(service.fetchRange(1, 0, 7)).catch((error: unknown) => error);

      expectRangeRequest().flush(encode('far too many bytes'), PARTIAL_CONTENT);

      await expectAsync(failure).toBeResolvedTo(jasmine.any(Error));
    });
  });

  describe('openReader', () => {
    it('opens a seekable reader for a plain file', () => {
      expect(service.openReader(FILE).kind).toBe('seekable');
    });

    it('opens a sequential reader for a gzip-compressed file, whatever the case of its extension', () => {
      expect(service.openReader({ ...FILE, filename: 'wordlist.txt.GZ' }).kind).toBe('sequential');
    });
  });

  it('does not request a range for an empty file', () => {
    let page!: PlainPreviewPage;
    service
      .loadPage({ fileId: 1, offset: 0, maxLines: 10, windowBytes: 1024, totalBytes: 0, isLineAligned: true })
      .subscribe((result) => (page = result));

    httpMock.expectNone(() => true);
    expect(page.lines).toEqual([]);
    expect(page.totalBytes).toBe(0);
  });
});
