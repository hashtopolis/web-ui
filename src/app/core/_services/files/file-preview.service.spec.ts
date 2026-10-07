import { firstValueFrom } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { FilePreviewPage } from '@models/file-preview.model';

import { FilePreviewRequest, FilePreviewService } from '@services/files/file-preview.service';
import { GzPreviewSession } from '@services/files/gz-preview-session';

describe('FilePreviewService', () => {
  let service: FilePreviewService;
  let httpMock: HttpTestingController;

  /** Encodes the bytes a mocked range response should return. */
  const encode = (text: string): ArrayBuffer => new TextEncoder().encode(text).buffer as ArrayBuffer;

  /**
   * Issues a page request and answers it with `body`, as the backend's range response would.
   *
   * @param overrides - Request fields that differ from the defaults.
   * @param body - Content the mocked window returns.
   */
  const loadPage = (overrides: Partial<FilePreviewRequest>, body: string): FilePreviewPage => {
    const request: FilePreviewRequest = {
      fileId: 1,
      offset: 0,
      maxLines: 100,
      windowBytes: 1024,
      totalBytes: encode(body).byteLength,
      isLineAligned: true,
      ...overrides
    };

    let page!: FilePreviewPage;
    service.loadPage(request).subscribe((result) => (page = result));

    const testRequest = httpMock.expectOne((candidate) => candidate.url.endsWith('/helper/getFile'));
    testRequest.flush(encode(body));

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

    const request = httpMock.expectOne((candidate) => candidate.url.endsWith('/helper/getFile'));
    expect(request.request.params.get('file')).toBe('7');
    expect(request.request.headers.get('Range')).toBe('bytes=100-163');
    expect(request.request.headers.get('X-Cache-Skip')).toBe('true');

    request.flush(encode(''));
  });

  it('clamps the requested window to the end of the file', () => {
    service
      .loadPage({ fileId: 1, offset: 90, maxLines: 10, windowBytes: 1024, totalBytes: 100, isLineAligned: true })
      .subscribe();

    const request = httpMock.expectOne((candidate) => candidate.url.endsWith('/helper/getFile'));
    expect(request.request.headers.get('Range')).toBe('bytes=90-99');

    request.flush(encode(''));
  });

  it('returns the whole lines of a window and reports where the next page starts', () => {
    const page = loadPage({ totalBytes: 1000 }, 'alpha\nbravo\ncharl');

    expect(page.lines).toEqual(['alpha', 'bravo']);
    expect(page.startByte).toBe(0);
    // The trailing fragment belongs to the next page, so it stops right after "bravo\n".
    expect(page.endByte).toBe(12);
    expect(page.hasPartialLine).toBeFalse();
  });

  it('keeps a final line that carries no terminator', () => {
    const page = loadPage({}, 'alpha\nbravo');

    expect(page.lines).toEqual(['alpha', 'bravo']);
    expect(page.endByte).toBe(page.totalBytes);
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

    httpMock.expectOne((candidate) => candidate.url.endsWith('/helper/getFile')).flush(encode('far too many bytes'));

    await expectAsync(failure).toBeResolvedTo(jasmine.any(Error));
  });

  it('opens a reading session for a gzip-compressed file', () => {
    const session = service.openGzSession(3, 10_000);

    expect(session).toBeInstanceOf(GzPreviewSession);
  });

  it('does not request a range for an empty file', () => {
    let page!: FilePreviewPage;
    service
      .loadPage({ fileId: 1, offset: 0, maxLines: 10, windowBytes: 1024, totalBytes: 0, isLineAligned: true })
      .subscribe((result) => (page = result));

    httpMock.expectNone(() => true);
    expect(page.lines).toEqual([]);
    expect(page.totalBytes).toBe(0);
  });
});
