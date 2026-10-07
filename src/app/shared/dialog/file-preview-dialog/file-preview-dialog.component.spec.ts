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

  /** The lines currently on screen, each prefixed by its gutter label. */
  const visibleRows = (): string[] =>
    Array.from(fixture.nativeElement.querySelectorAll('.font-mono > div') as NodeListOf<HTMLElement>).map((row) =>
      Array.from(row.querySelectorAll('span'))
        .map((cell) => (cell.textContent ?? '').trim())
        .join(' ')
    );

  const isEnabled = (label: string): boolean =>
    !(fixture.nativeElement.querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement).disabled;

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
    expect(visibleRows()[0]).toBe('1 line1');
    expect(visibleRows()[9]).toBe('10 line10');
    expect(isEnabled('Start of file')).toBeFalse();
    expect(isEnabled('Previous page')).toBeFalse();
    expect(isEnabled('Next page')).toBeTrue();
  });

  it('pages forwards and back again through the lines it already walked', () => {
    navigate('Next page');
    expect(visibleRows()[0]).toBe('11 line11');

    navigate('Previous page');
    expect(visibleRows()[0]).toBe('1 line1');
    expect(visibleRows()[9]).toBe('10 line10');
  });

  it('jumps to the last lines of the file', () => {
    navigate('End of file');

    expect(visibleRows().length).toBe(10);
    expect(visibleRows()[9]).toContain('line30');
    expect(isEnabled('Next page')).toBeFalse();
  });

  it('steps back from the end of the file, which it was never paged to', () => {
    navigate('End of file');
    expect(isEnabled('Previous page')).withContext('previous is reachable from the end').toBeTrue();

    navigate('Previous page');
    expect(visibleRows()[0]).toContain('line11');
    expect(visibleRows()[9]).toContain('line20');
  });

  it('restores real line numbers once stepping back reaches the start of the file', () => {
    navigate('End of file');
    navigate('Previous page');
    // Line numbering is unknowable after a jump, so the gutter holds placeholders.
    expect(visibleRows()[0]).toBe('· line11');

    navigate('Previous page');
    expect(visibleRows()[0]).toBe('1 line1');
    expect(isEnabled('Previous page')).toBeFalse();
    expect(isEnabled('Start of file')).toBeFalse();
  });

  it('reads pages that butt up against each other with no lines lost between them', () => {
    navigate('End of file');
    const lastPage = visibleRows();
    navigate('Previous page');
    const previousPage = visibleRows();

    const strip = (rows: string[]): string[] => rows.map((row) => row.replace(/^\S+ /, ''));
    expect(strip(previousPage).concat(strip(lastPage))).toEqual(LINES.slice(10));
  });
});
