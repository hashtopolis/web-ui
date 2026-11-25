import { gzipSync } from 'node:zlib';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, TestRequest, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { JFile } from '@models/file.model';

import { FilePreviewDialogComponent } from '@src/app/shared/dialog/file-preview-dialog/file-preview-dialog.component';
import { provideDisabledMaterialAnimations } from '@src/app/testing/material-animations';

/** A 30-line file, small enough that one window covers it and every page boundary is predictable. */
const LINES = Array.from({ length: 30 }, (unused, index) => `line${index + 1}`);
const TEXT = LINES.join('\n') + '\n';
const FILE_BYTES = new TextEncoder().encode(TEXT);
/** The same lines gzipped, copied out of the shared pool a Node `Buffer` slices into. */
const GZIP_BYTES = new Uint8Array(gzipSync(TEXT));

const fileRecord = (overrides: Partial<JFile>): JFile => ({
  id: 1,
  type: 'file',
  filename: 'wordlist.txt',
  size: FILE_BYTES.byteLength,
  isSecret: false,
  fileType: 0,
  accessGroupId: 1,
  lineCount: LINES.length,
  checksum: null,
  ...overrides
});

describe('FilePreviewDialogComponent', () => {
  let fixture: ComponentFixture<FilePreviewDialogComponent>;
  let component: FilePreviewDialogComponent;
  let httpMock: HttpTestingController;
  /** What the mocked backend serves for the file. */
  let stored: Uint8Array;
  /** Whether the backend answers the next preview request with a server error. */
  let failNextRequest: boolean;

  /** The preview requests waiting for an answer, taken off the backend mock's queue. */
  const takePendingRequests = (): TestRequest[] =>
    httpMock.match((candidate) => candidate.url.endsWith('/helper/getFile'));

  /** Answers one preview request with the bytes it asked for, the way the backend's range endpoint would. */
  const serveRange = (request: TestRequest): void => {
    if (failNextRequest) {
      failNextRequest = false;
      request.flush(new ArrayBuffer(0), { status: 500, statusText: 'Internal Server Error' });
      return;
    }

    const [start, end] = (request.request.headers.get('Range') ?? '').replace('bytes=', '').split('-').map(Number);
    request.flush(stored.slice(start, end + 1).buffer as ArrayBuffer);
  };

  /** Answers every pending preview request, including requests that answering an earlier one sets off. */
  const serveRanges = (): void => {
    for (let pending = takePendingRequests(); pending.length > 0; pending = takePendingRequests()) {
      pending.forEach(serveRange);
    }

    fixture.detectChanges();
  };

  /** Serves the requests and waits until the dialog has finished loading what they started. */
  const settle = async (): Promise<void> => {
    serveRanges();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(component['isLoading']).toBe(false);
    });
  };

  /**
   * Opens the dialog on a file and, unless told otherwise, waits for its first page.
   *
   * @param file - The file record the dialog is opened with.
   * @param content - The bytes the backend serves for it.
   * @param options - Whether to serve the requests and wait for the first page.
   */
  const openDialog = async (
    file: JFile,
    content: Uint8Array,
    { waitForFirstPage = true }: { waitForFirstPage?: boolean } = {}
  ): Promise<void> => {
    stored = content;
    await TestBed.configureTestingModule({
      imports: [FilePreviewDialogComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideDisabledMaterialAnimations(),
        { provide: MAT_DIALOG_DATA, useValue: { file } },
        { provide: MatDialogRef, useValue: { close: vi.fn().mockName('close') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilePreviewDialogComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // Ten lines a page splits this file into three, so paging has somewhere to go in both directions.
    component['linesPerPage'] = 10;
    fixture.detectChanges();

    if (waitForFirstPage) {
      await settle();
    }
  };

  const button = (label: string): HTMLButtonElement =>
    fixture.nativeElement.querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement;

  /** Clicks one of the navigation buttons and serves the page it requests. */
  const navigate = async (label: string): Promise<void> => {
    expect(button(label), `button "${label}"`).not.toBeNull();
    expect(button(label).disabled, `button "${label}" is enabled`).toBe(false);
    button(label).click();
    fixture.detectChanges();
    await settle();
  };

  /** The lines currently on screen, each prefixed by its gutter label. */
  const visibleRows = (): string[] =>
    Array.from(fixture.nativeElement.querySelectorAll('.font-mono > div') as NodeListOf<HTMLElement>).map((row) =>
      Array.from(row.querySelectorAll('span'))
        .map((cell) => (cell.textContent ?? '').trim())
        .join(' ')
    );

  const isEnabled = (label: string): boolean => !button(label).disabled;

  /** Everything the dialog shows as text, whitespace collapsed. */
  const dialogText = (): string => (fixture.nativeElement.textContent ?? '').replace(/\s+/g, ' ');

  /** What assistive technology reads out as a button's description, which is where its tooltip goes. */
  const accessibleDescription = (label: string): string =>
    (button(label).getAttribute('aria-describedby') ?? '')
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent ?? '')
      .join(' ')
      .trim();

  beforeEach(() => {
    failNextRequest = false;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('on a plain file', () => {
    beforeEach(async () => {
      await openDialog(fileRecord({}), FILE_BYTES);
    });

    it('opens on the first lines of the file', () => {
      expect(visibleRows()[0]).toBe('1 line1');
      expect(visibleRows()[9]).toBe('10 line10');
      expect(isEnabled('Start of file')).toBe(false);
      expect(isEnabled('Previous page')).toBe(false);
      expect(isEnabled('Next page')).toBe(true);
    });

    it('pages forwards and back again through the lines it already walked', async () => {
      await navigate('Next page');
      expect(visibleRows()[0]).toBe('11 line11');

      await navigate('Previous page');
      expect(visibleRows()[0]).toBe('1 line1');
      expect(visibleRows()[9]).toBe('10 line10');
    });

    it('jumps to the last lines of the file', async () => {
      await navigate('End of file');

      expect(visibleRows().length).toBe(10);
      expect(visibleRows()[9]).toContain('line30');
      expect(isEnabled('Next page')).toBe(false);
    });

    it('steps back from the end of the file, which it was never paged to', async () => {
      await navigate('End of file');
      expect(isEnabled('Previous page'), 'previous is reachable from the end').toBe(true);

      await navigate('Previous page');
      expect(visibleRows()[0]).toContain('line11');
      expect(visibleRows()[9]).toContain('line20');
    });

    it('restores real line numbers once stepping back reaches the start of the file', async () => {
      await navigate('End of file');
      await navigate('Previous page');
      // Line numbering is unknowable after a jump, so the gutter holds placeholders.
      expect(visibleRows()[0]).toBe('· line11');

      await navigate('Previous page');
      expect(visibleRows()[0]).toBe('1 line1');
      expect(isEnabled('Previous page')).toBe(false);
      expect(isEnabled('Start of file')).toBe(false);
    });

    it('reads pages that butt up against each other with no lines lost between them', async () => {
      await navigate('End of file');
      const lastPage = visibleRows();
      await navigate('Previous page');
      const previousPage = visibleRows();

      const strip = (rows: string[]): string[] => rows.map((row) => row.replace(/^\S+ /, ''));
      expect(strip(previousPage).concat(strip(lastPage))).toStrictEqual(LINES.slice(10));
    });

    it('labels its position in bytes of the whole file', () => {
      expect(dialogText()).toContain('bytes 0–60 of 201 (30.3%)');
      expect(dialogText()).not.toContain('decompressed');
    });

    it('names no compression', () => {
      expect(dialogText()).toContain(' · 30 lines');
      expect(dialogText()).not.toContain('gzip');
    });
  });

  describe('while the file is still opening', () => {
    it('opens it only once when the page size changes meanwhile, and shows the first page at the new size', async () => {
      await openDialog(fileRecord({}), FILE_BYTES, { waitForFirstPage: false });
      component['linesPerPage'] = 25;
      component['onPageSizeChange']();

      const headerRequests = takePendingRequests();
      headerRequests.forEach(serveRange);
      await settle();

      expect(headerRequests.length).toBe(1);
      expect(visibleRows().length).toBe(25);
      expect(visibleRows()[0]).toBe('1 line1');
    });
  });

  describe('when the file cannot be opened', () => {
    beforeEach(async () => {
      failNextRequest = true;
      await openDialog(fileRecord({}), FILE_BYTES);
    });

    it('says why, without claiming the file is empty', () => {
      expect(dialogText()).toContain('Could not read the file (HTTP 500).');
      expect(dialogText()).not.toContain('empty file');
    });

    it('does not describe a file whose format is still unknown as compressed', () => {
      // The plain tooltip matches the button's label, so it adds no description at all.
      expect(accessibleDescription('End of file')).not.toContain('compressed');
    });

    it('opens the file again from "Start of file"', async () => {
      await navigate('Start of file');

      expect(visibleRows()[0]).toBe('1 line1');
      expect(dialogText()).not.toContain('Could not read the file');
    });
  });

  describe('on a gzip file decompressed whole', () => {
    beforeEach(async () => {
      await openDialog(fileRecord({ filename: 'wordlist.txt.gz', size: GZIP_BYTES.byteLength }), GZIP_BYTES);
    });

    it('opens on the first decompressed lines', () => {
      expect(visibleRows()[0]).toBe('1 line1');
      expect(visibleRows()[9]).toBe('10 line10');
    });

    it('names the compression next to the line count', () => {
      expect(dialogText()).toContain(' · gzip · 30 lines');
    });

    it('jumps to the end of the file, which the preview reaches', async () => {
      await navigate('End of file');

      expect(visibleRows()[9]).toContain('line30');
      expect(isEnabled('Next page')).toBe(false);
      expect(dialogText()).not.toContain('The preview stops here');
    });

    it('labels its position in decompressed bytes of the whole file', () => {
      expect(dialogText()).toContain('decompressed bytes 0–60 of 201 (30.3%)');
    });
  });

  describe('on a gzip file only the start of which is decompressed', () => {
    beforeEach(async () => {
      // The record claims more than the first part holds, as for a file larger than the preview reads.
      await openDialog(fileRecord({ filename: 'wordlist.txt.gz', size: 4_194_304 }), GZIP_BYTES);
    });

    it('disables the jump to the end of the file, and says why', () => {
      expect(isEnabled('End of file')).toBe(false);
      expect(accessibleDescription('End of file')).toBe('Not available for this compressed file');
    });

    it('stays at the end of the preview when the page size changes there', async () => {
      await navigate('Next page');
      await navigate('Next page');

      component['linesPerPage'] = 25;
      component['onPageSizeChange']();
      await settle();

      expect(visibleRows().length).toBe(25);
      expect(visibleRows()[24]).toContain('line30');
      expect(dialogText()).toContain('The preview stops here. Download the file to see the rest.');
    });

    it('says the preview stops on its last page, and only there', async () => {
      expect(dialogText()).not.toContain('The preview stops here');

      await navigate('Next page');
      await navigate('Next page');

      expect(visibleRows()[9]).toBe('30 line30');
      expect(isEnabled('Next page')).toBe(false);
      expect(dialogText()).toContain('The preview stops here. Download the file to see the rest.');
    });

    it('labels its position without a total, which would describe the preview rather than the file', () => {
      expect(dialogText()).toContain('decompressed bytes 0–60');
      expect(dialogText()).not.toContain('decompressed bytes 0–60 of');
    });
  });

  it('shows why a gzip file that decodes to nothing cannot be previewed', async () => {
    const damaged = new Uint8Array([0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0xff, 0xff, 0xff]);

    await openDialog(fileRecord({ size: damaged.byteLength }), damaged);

    expect(dialogText()).toContain('Could not decompress the file. It may be damaged.');
  });
});
