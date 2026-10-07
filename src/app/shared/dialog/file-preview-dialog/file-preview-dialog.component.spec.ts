import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { JFile } from '@models/file.model';

import { FilePreviewDialogComponent } from '@src/app/shared/dialog/file-preview-dialog/file-preview-dialog.component';

/** A 30-line file, small enough that one window covers it and every page boundary is predictable. */
const LINES = Array.from({ length: 30 }, (unused, index) => `line${index + 1}`);
const FILE_BYTES = new TextEncoder().encode(LINES.join('\n') + '\n');

const FILE: JFile = {
  id: 1,
  type: 'file',
  filename: 'wordlist.txt',
  size: FILE_BYTES.byteLength,
  isSecret: false,
  fileType: 0,
  accessGroupId: 1,
  lineCount: LINES.length
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
  const compressed = new Uint8Array(chunks.reduce((length, chunk) => length + chunk.length, 0));
  let position = 0;
  for (const chunk of chunks) {
    compressed.set(chunk, position);
    position += chunk.length;
  }
  return compressed;
};

/** Lets the dialog's asynchronous decompression settle before the DOM is inspected. */
const settle = async (): Promise<void> => {
  for (let i = 0; i < 5; i++) {
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  }
};

/**
 * Waits until the dialog has finished loading the page it is on, however long the file's
 * decompression takes, and renders the result.
 */
const awaitPageLoaded = async (fixture: ComponentFixture<FilePreviewDialogComponent>): Promise<void> => {
  for (let attempt = 0; attempt < 250 && fixture.componentInstance['isLoading']; attempt++) {
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  }
  fixture.detectChanges();
};

/** The lines currently on screen, each prefixed by its gutter label. */
const visibleRows = (fixture: ComponentFixture<FilePreviewDialogComponent>): string[] =>
  Array.from(fixture.nativeElement.querySelectorAll('.font-mono > div') as NodeListOf<HTMLElement>).map((row) =>
    Array.from(row.querySelectorAll('span'))
      .map((cell) => (cell.textContent ?? '').trim())
      .join(' ')
  );

/** Whether the navigation button with this label can be clicked. */
const isEnabled = (fixture: ComponentFixture<FilePreviewDialogComponent>, label: string): boolean =>
  !(fixture.nativeElement.querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement).disabled;

describe('FilePreviewDialogComponent', () => {
  let fixture: ComponentFixture<FilePreviewDialogComponent>;
  let component: FilePreviewDialogComponent;
  let httpMock: HttpTestingController;

  /**
   * Answers the pending preview request with the bytes it asked for, the way the backend's range
   * endpoint would.
   */
  const serveRange = (): void => {
    const request = httpMock.expectOne((candidate) => candidate.url.endsWith('/helper/getFile'));
    const [start, end] = (request.request.headers.get('Range') ?? '').replace('bytes=', '').split('-').map(Number);
    request.flush(FILE_BYTES.slice(start, end + 1).buffer as ArrayBuffer);
    fixture.detectChanges();
  };

  /** Clicks one of the navigation buttons and serves the page it requests. */
  const navigate = (label: string): void => {
    const button: HTMLButtonElement | null = fixture.nativeElement.querySelector(`button[aria-label="${label}"]`);
    expect(button).withContext(`button "${label}"`).not.toBeNull();
    expect(button!.disabled).withContext(`button "${label}" is enabled`).toBeFalse();
    button!.click();
    fixture.detectChanges();
    serveRange();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilePreviewDialogComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        { provide: MAT_DIALOG_DATA, useValue: { file: FILE } },
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilePreviewDialogComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // Ten lines a page splits this file into three, so paging has somewhere to go in both directions.
    component['linesPerPage'] = 10;
    fixture.detectChanges();
    serveRange();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('opens on the first lines of the file', () => {
    expect(visibleRows(fixture)[0]).toBe('1 line1');
    expect(visibleRows(fixture)[9]).toBe('10 line10');
    expect(isEnabled(fixture, 'Start of file')).toBeFalse();
    expect(isEnabled(fixture, 'Previous page')).toBeFalse();
    expect(isEnabled(fixture, 'Next page')).toBeTrue();
  });

  it('pages forwards and back again through the lines it already walked', () => {
    navigate('Next page');
    expect(visibleRows(fixture)[0]).toBe('11 line11');

    navigate('Previous page');
    expect(visibleRows(fixture)[0]).toBe('1 line1');
    expect(visibleRows(fixture)[9]).toBe('10 line10');
  });

  it('jumps to the last lines of the file', () => {
    navigate('End of file');

    expect(visibleRows(fixture).length).toBe(10);
    expect(visibleRows(fixture)[9]).toContain('line30');
    expect(isEnabled(fixture, 'Next page')).toBeFalse();
  });

  it('steps back from the end of the file, which it was never paged to', () => {
    navigate('End of file');
    expect(isEnabled(fixture, 'Previous page')).withContext('previous is reachable from the end').toBeTrue();

    navigate('Previous page');
    expect(visibleRows(fixture)[0]).toContain('line11');
    expect(visibleRows(fixture)[9]).toContain('line20');
  });

  it('restores real line numbers once stepping back reaches the start of the file', () => {
    navigate('End of file');
    navigate('Previous page');
    // Line numbering is unknowable after a jump, so the gutter holds placeholders.
    expect(visibleRows(fixture)[0]).toBe('· line11');

    navigate('Previous page');
    expect(visibleRows(fixture)[0]).toBe('1 line1');
    expect(isEnabled(fixture, 'Previous page')).toBeFalse();
    expect(isEnabled(fixture, 'Start of file')).toBeFalse();
  });

  it('reads pages that butt up against each other with no lines lost between them', () => {
    navigate('End of file');
    const lastPage = visibleRows(fixture);
    navigate('Previous page');
    const previousPage = visibleRows(fixture);

    const strip = (rows: string[]): string[] => rows.map((row) => row.replace(/^\S+ /, ''));
    expect(strip(previousPage).concat(strip(lastPage))).toEqual(LINES.slice(10));
  });
});

describe('FilePreviewDialogComponent on a gzip-compressed file', () => {
  let gzBytes: Uint8Array;
  let file: JFile;
  let fixture: ComponentFixture<FilePreviewDialogComponent>;
  let component: FilePreviewDialogComponent;
  let httpMock: HttpTestingController;

  /**
   * Answers the pending range request with the slice of the compressed file it asked for, then
   * waits for the dialog to decompress it.
   */
  const serveFirstWindow = async (): Promise<void> => {
    const request = httpMock.expectOne((candidate) => candidate.url.endsWith('/helper/getFile'));
    const [start, end] = (request.request.headers.get('Range') ?? '').replace('bytes=', '').split('-').map(Number);
    request.flush(gzBytes.slice(start, end + 1).buffer as ArrayBuffer);
    await awaitPageLoaded(fixture);
  };

  /** Clicks a navigation button; compressed paging needs no further request, so none is served. */
  const navigate = async (label: string): Promise<void> => {
    const button: HTMLButtonElement | null = fixture.nativeElement.querySelector(`button[aria-label="${label}"]`);
    expect(button).withContext(`button "${label}"`).not.toBeNull();
    expect(button!.disabled).withContext(`button "${label}" is enabled`).toBeFalse();
    button!.click();
    await awaitPageLoaded(fixture);
  };

  beforeAll(async () => {
    gzBytes = await gz(`${LINES.join('\n')}\n`);
    file = { ...FILE, filename: 'wordlist.txt.gz', size: gzBytes.byteLength };
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilePreviewDialogComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        { provide: MAT_DIALOG_DATA, useValue: { file } },
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilePreviewDialogComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // Ten lines a page splits the decompressed file into three, as in the plain-file suite above.
    component['linesPerPage'] = 10;
    fixture.detectChanges();
    await serveFirstWindow();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('opens on the first decompressed lines and cannot jump to the end', () => {
    expect(visibleRows(fixture)[0]).toBe('1 line1');
    expect(visibleRows(fixture)[9]).toBe('10 line10');
    expect(isEnabled(fixture, 'Start of file')).toBeFalse();
    expect(isEnabled(fixture, 'Previous page')).toBeFalse();
    expect(isEnabled(fixture, 'Next page')).toBeTrue();
    // The end of a compressed file is only reachable by decompressing everything before it.
    expect(isEnabled(fixture, 'End of file')).toBeFalse();
  });

  it('pages forwards and back through decompressed lines without further requests', async () => {
    await navigate('Next page');
    // Decompression always runs from the first byte, so line numbers stay exact on every page.
    expect(visibleRows(fixture)[0]).toBe('11 line11');

    await navigate('Previous page');
    expect(visibleRows(fixture)[0]).toBe('1 line1');

    // The whole compressed file is cached after the first window, so paging needs no new request.
    await settle();
    httpMock.expectNone((candidate) => candidate.url.endsWith('/helper/getFile'));
  });

  it('stops at the last decompressed lines of the file', async () => {
    await navigate('Next page');
    await navigate('Next page');

    expect(visibleRows(fixture)[9]).toBe('30 line30');
    expect(isEnabled(fixture, 'Next page')).toBeFalse();
  });

  it('reports where the reader stands in decompressed bytes', () => {
    expect(fixture.nativeElement.textContent).toContain('decompressed bytes');
  });
});

describe('FilePreviewDialogComponent on a damaged gzip file', () => {
  let gzBytes: Uint8Array;
  let fixture: ComponentFixture<FilePreviewDialogComponent>;
  let httpMock: HttpTestingController;

  /** Clicks a navigation button; the damaged file is cached whole, so no request is served. */
  const navigate = async (label: string): Promise<void> => {
    const button: HTMLButtonElement | null = fixture.nativeElement.querySelector(`button[aria-label="${label}"]`);
    expect(button).withContext(`button "${label}"`).not.toBeNull();
    expect(button!.disabled).withContext(`button "${label}" is enabled`).toBeFalse();
    button!.click();
    await awaitPageLoaded(fixture);
  };

  /**
   * Opens the dialog on the damaged file, showing pages of `linesPerPage` lines.
   *
   * @param linesPerPage - How many lines a page should hold.
   */
  const openDialog = async (linesPerPage: number): Promise<void> => {
    const file: JFile = { ...FILE, filename: 'wordlist.txt.gz', size: gzBytes.byteLength };
    await TestBed.configureTestingModule({
      imports: [FilePreviewDialogComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        { provide: MAT_DIALOG_DATA, useValue: { file } },
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilePreviewDialogComponent);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.componentInstance['linesPerPage'] = linesPerPage;
    fixture.detectChanges();

    const request = httpMock.expectOne((candidate) => candidate.url.endsWith('/helper/getFile'));
    const [start, end] = (request.request.headers.get('Range') ?? '').replace('bytes=', '').split('-').map(Number);
    request.flush(gzBytes.slice(start, end + 1).buffer as ArrayBuffer);
    await awaitPageLoaded(fixture);
  };

  beforeAll(async () => {
    // Six bytes off the end leave the compressed data itself intact but cut the stream's trailer,
    // so everything decodes up to the thirty lines and then the stream ends in an error.
    gzBytes = (await gz(`${LINES.join('\n')}\n`)).slice(0, -6);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('shows everything that could be decompressed, with a warning', async () => {
    await openDialog(100);

    expect(visibleRows(fixture).length).toBe(30);
    expect(visibleRows(fixture)[29]).toBe('30 line30');
    expect(fixture.nativeElement.textContent).toContain('Decompression ended early');
    expect(isEnabled(fixture, 'Next page')).toBeFalse();
  });

  it('reveals the damage once a page asks for more than could be decompressed', async () => {
    await openDialog(10);

    // The first page fills from lines decoded before the damage, so it shows no warning yet.
    expect(fixture.nativeElement.textContent).not.toContain('Decompression ended early');
    expect(isEnabled(fixture, 'Next page')).toBeTrue();

    await navigate('Next page');

    expect(fixture.nativeElement.textContent).toContain('Decompression ended early');
  });
});
