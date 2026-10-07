import { Observable } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PlainPreviewPage } from '@models/file-preview.model';
import { JFile } from '@models/file.model';

import { FilePreviewService } from '@services/files/file-preview.service';
import { RangePreviewReader } from '@services/files/range-preview-reader';

/** A plain file whose lines the backend never counted, so windows fall back to the default line length. */
const FILE: JFile = {
  id: 1,
  type: 'file',
  filename: 'wordlist.txt',
  size: 100_000,
  isSecret: false,
  fileType: 0,
  accessGroupId: 1,
  lineCount: 0
};

describe('RangePreviewReader', () => {
  let service: FilePreviewService;
  let httpMock: HttpTestingController;

  /** Encodes the bytes a mocked range response should return. */
  const encode = (text: string): ArrayBuffer => new TextEncoder().encode(text).buffer as ArrayBuffer;

  /** Opens a seekable reader on a variation of {@link FILE}. */
  const openReader = (overrides: Partial<JFile> = {}): RangePreviewReader =>
    service.openReader({ ...FILE, ...overrides }) as RangePreviewReader;

  /** A page the reader returned earlier, as the starting point for reading on from it. */
  const plainPage = (overrides: Partial<PlainPreviewPage>): PlainPreviewPage => ({
    kind: 'plain',
    lines: [],
    startByte: 0,
    endByte: 0,
    totalBytes: FILE.size,
    hasPartialLine: false,
    isBinary: false,
    hasMore: true,
    ...overrides
  });

  /**
   * Subscribes to a page read, answers the range request it issues with `body`, and reports both the
   * page and the range that was asked for.
   */
  const read = (page$: Observable<PlainPreviewPage>, body = ''): { page: PlainPreviewPage; range: string } => {
    let page!: PlainPreviewPage;
    page$.subscribe((result) => (page = result));

    const request = httpMock.expectOne((candidate) => candidate.url.endsWith('/helper/getFile'));
    const range = request.request.headers.get('Range') ?? '';
    request.flush(encode(body));

    return { page, range };
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

  describe('window sizing', () => {
    it("sizes the window from the file's average line length, with headroom", () => {
      // 1,000,000 bytes over 10,000 lines is 100 bytes a line; 100 lines with 40% slack is 14,000 bytes.
      const { range } = read(openReader({ size: 1_000_000, lineCount: 10_000 }).readForward(0, 100));

      expect(range).toBe('bytes=0-13999');
    });

    it('never asks for less than the minimum window', () => {
      // 10 bytes a line, 10 lines and 40% slack come to 140 bytes, far below the 4 KiB floor.
      const { range } = read(openReader({ size: 10_000, lineCount: 1_000 }).readForward(0, 10));

      expect(range).toBe('bytes=0-4095');
    });

    it('caps the window at one mebibyte', () => {
      const { range } = read(openReader({ size: 1_000_000_000, lineCount: 1 }).readForward(0, 100));

      expect(range).toBe('bytes=0-1048575');
    });

    it('assumes a default line length when the lines of the file were never counted', () => {
      // 64 bytes a line, 100 lines and 40% slack come to 8,960 bytes.
      const { range } = read(openReader().readForward(0, 100));

      expect(range).toBe('bytes=0-8959');
    });
  });

  it('reads forward from an offset that sits at the start of a line', () => {
    const { page, range } = read(openReader().readForward(500, 2), 'alpha\nbravo\ncharlie\n');

    expect(range).toBe('bytes=500-4595');
    expect(page.lines).toEqual(['alpha', 'bravo']);
    expect(page.startByte).toBe(500);
  });

  describe('readNext', () => {
    it('continues where the previous page ended, treating that offset as the start of a line', () => {
      const previous = plainPage({ startByte: 0, endByte: 12 });

      const { page, range } = read(openReader().readNext(previous, 100), 'charlie\ndelta\n');

      expect(range).toBe('bytes=12-8971');
      expect(page.lines).toEqual(['charlie', 'delta']);
      expect(page.startByte).toBe(12);
    });

    it('skips a whole window past a page that consumed nothing, dropping the fragment it lands in', () => {
      // A page that consumed nothing sits on a line longer than its window; re-reading it would loop.
      const previous = plainPage({ startByte: 0, endByte: 0 });

      const { page, range } = read(openReader().readNext(previous, 100), 'tail\nwhole\n');

      expect(range).toBe('bytes=8960-17919');
      expect(page.lines).toEqual(['whole']);
      expect(page.startByte).toBe(8965);
    });
  });

  describe('readEndingAt', () => {
    it('reads the window that ends where the given offset starts and fills it backwards', () => {
      const { page, range } = read(openReader().readEndingAt(20_000, 2), 'avo\ncharlie\ndelta\n');

      // One minimum-sized window back from 20,000; the window lands mid-line, and that fragment is dropped.
      expect(range).toBe('bytes=15904-19999');
      expect(page.lines).toEqual(['charlie', 'delta']);
      expect(page.startByte).toBe(15_908);
    });

    it('does not read past the start of the file', () => {
      const { page, range } = read(openReader().readEndingAt(512, 10), 'alpha\nbravo\n');

      expect(range).toBe('bytes=0-511');
      expect(page.lines).toEqual(['alpha', 'bravo']);
      expect(page.startByte).toBe(0);
    });
  });

  it('reads the last lines of the file from the window that ends at its final byte', () => {
    const { page, range } = read(openReader({ size: 50_000 }).readLastLines(2), 'x\nlast\nlines\n');

    expect(range).toBe('bytes=45904-49999');
    expect(page.lines).toEqual(['last', 'lines']);
  });
});
