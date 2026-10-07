import { Clipboard } from '@angular/cdk/clipboard';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FILE_PREVIEW_DEFAULT_PAGE_SIZE, FILE_PREVIEW_PAGE_SIZES, FilePreviewPage } from '@models/file-preview.model';

import { FilePreviewService } from '@services/files/file-preview.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';

import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { FilePreviewDialogData } from '@src/app/shared/dialog/file-preview-dialog/file-preview-dialog.model';
import { formatFileSize } from '@src/app/shared/utils/util';

/** A page already visited, kept so stepping back lands on exactly the same lines. */
interface VisitedPage {
  offset: number;
  firstLineNumber: number | null;
}

/** Where to read next, and how to number what comes back. */
interface PageTarget extends VisitedPage {
  isLineAligned: boolean;
  /** Fill the page backwards from the end of the window, rather than forwards from its start. */
  takeLastLines?: boolean;
  /** Byte window to read, when it has to stop at a particular offset rather than span a full page. */
  windowBytes?: number;
}

/**
 * Pages through the contents of a stored wordlist or rules file without downloading it.
 *
 * Files here can be hundreds of gigabytes, so there is deliberately no page count and no jump to an
 * arbitrary page: the dialog walks forwards and backwards a window at a time, and can jump to the
 * two offsets that are knowable without reading the file — its start and its end.
 */
@Component({
  selector: 'app-file-preview-dialog',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
    ButtonsModule
  ],
  templateUrl: './file-preview-dialog.component.html'
})
export class FilePreviewDialogComponent implements OnInit {
  /** Headroom over the file's average line length, so one request usually fills a whole page. */
  private static readonly WINDOW_SLACK = 1.4;
  private static readonly MIN_WINDOW_BYTES = 4_096;
  private static readonly MAX_WINDOW_BYTES = 1_048_576;
  /** Average line length assumed for a file whose lines the backend has not counted. */
  private static readonly FALLBACK_LINE_BYTES = 64;

  protected readonly data: FilePreviewDialogData = inject(MAT_DIALOG_DATA);
  protected readonly pageSizes = FILE_PREVIEW_PAGE_SIZES;

  private readonly dialogRef = inject(MatDialogRef<FilePreviewDialogComponent>);
  private readonly previewService = inject(FilePreviewService);
  private readonly gs = inject(GlobalService);
  private readonly clipboard = inject(Clipboard);
  private readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);

  protected linesPerPage = FILE_PREVIEW_DEFAULT_PAGE_SIZE;
  protected page: FilePreviewPage | null = null;
  protected isLoading = false;
  protected errorMessage = '';

  /** 1-based number of the first displayed line, or `null` once a seek made it unknowable. */
  protected firstLineNumber: number | null = 1;

  /** Pages walked through, oldest first, so "previous" can step back exactly. */
  private trail: VisitedPage[] = [];

  ngOnInit(): void {
    this.showFirstPage();
  }

  // --- Navigation ---

  protected showFirstPage(): void {
    this.trail = [];
    this.loadPage({ offset: 0, isLineAligned: true, firstLineNumber: 1 });
  }

  protected showPreviousPage(): void {
    // Stepping back through pages already visited is exact, and keeps their line numbering.
    const previous = this.trail.pop();
    if (previous) {
      this.loadPage({ offset: previous.offset, isLineAligned: true, firstLineNumber: previous.firstLineNumber });
      return;
    }

    // Nothing was paged through to get here, so read the window that ends where this page starts and
    // fill it backwards. This is what makes the jump to the end of the file a place to read from
    // rather than a dead end.
    const current = this.page;
    if (!current || current.startByte === 0) {
      return;
    }
    const windowBytes = Math.min(this.windowBytes, current.startByte);
    const offset = current.startByte - windowBytes;
    this.loadPage({
      offset,
      windowBytes,
      isLineAligned: offset === 0,
      takeLastLines: true,
      firstLineNumber: null
    });
  }

  protected showNextPage(): void {
    const current = this.page;
    if (!current) {
      return;
    }
    this.trail.push({ offset: current.startByte, firstLineNumber: this.firstLineNumber });

    // A window holding no line terminator consumes nothing, so skip past it rather than re-reading it.
    const hasAdvanced = current.endByte > current.startByte;
    const offset = hasAdvanced ? current.endByte : current.startByte + this.windowBytes;

    this.loadPage({
      offset,
      isLineAligned: hasAdvanced,
      // A page cut mid-line continues into the next one, so the line number no longer lines up.
      firstLineNumber:
        this.firstLineNumber === null || current.hasPartialLine ? null : this.firstLineNumber + current.lines.length
    });
  }

  protected showLastPage(): void {
    this.trail = [];
    const offset = Math.max(0, this.data.file.size - this.windowBytes);
    this.loadPage({
      offset,
      isLineAligned: offset === 0,
      takeLastLines: true,
      // Nothing here fixes which line of the file comes first: the page is filled backwards from the
      // end, and the file's reported line total counts terminators rather than lines. The byte
      // position tells the reader where they are instead.
      firstLineNumber: null
    });
  }

  /** Reloads the page currently on screen at the newly chosen size, keeping the reader in place. */
  protected onPageSizeChange(): void {
    if (!this.page) {
      this.showFirstPage();
      return;
    }
    // A page sitting at the end of the file should stay there rather than drift forward off it.
    if (this.page.endByte >= this.page.totalBytes) {
      this.showLastPage();
      return;
    }
    this.loadPage({
      offset: this.page.startByte,
      isLineAligned: true,
      firstLineNumber: this.firstLineNumber
    });
  }

  // --- Template helpers ---

  protected get hasPreviousPage(): boolean {
    return this.trail.length > 0 || (this.page !== null && this.page.startByte > 0);
  }

  protected get hasNextPage(): boolean {
    return this.page !== null && this.page.endByte < this.page.totalBytes;
  }

  /** Whether there is anything on screen worth copying. */
  protected get hasLines(): boolean {
    return (this.page?.lines.length ?? 0) > 0;
  }

  protected get isAtFileStart(): boolean {
    return this.page !== null && this.page.startByte === 0;
  }

  /** Where in the file the current page sits, in bytes rather than in pages. */
  protected get positionLabel(): string {
    if (!this.page || this.page.totalBytes === 0) {
      return 'empty file';
    }
    const { startByte, endByte, totalBytes } = this.page;
    const percentage = ((endByte / totalBytes) * 100).toFixed(1);
    return `bytes ${startByte.toLocaleString()}–${Math.max(endByte - 1, startByte).toLocaleString()} of ${totalBytes.toLocaleString()} (${percentage}%)`;
  }

  protected get fileSizeLabel(): string {
    return formatFileSize(this.data.file.size, 'short');
  }

  /** Line total of the file, or an empty string when the backend has not counted its lines. */
  protected get lineCountLabel(): string {
    const { lineCount } = this.data.file;
    return lineCount > 0 ? ` · ${lineCount.toLocaleString()} lines` : '';
  }

  /**
   * Gutter label for a displayed line: its number in the file, or a placeholder once a seek made the
   * numbering unknowable.
   *
   * @param index - Index of the line within the current page.
   */
  protected lineLabel(index: number): string {
    return this.firstLineNumber === null ? '·' : (this.firstLineNumber + index).toLocaleString();
  }

  // --- Actions ---

  protected copyPage(): void {
    if (!this.page?.lines.length) {
      return;
    }
    this.clipboard.copy(this.page.lines.join('\n'));
    this.alertService.showSuccessMessage(`Copied ${this.page.lines.length} lines to the clipboard!`);
  }

  protected downloadFile(): void {
    this.gs.getFile(SERV.GET_FILES, this.data.file.id, this.data.file.filename);
  }

  protected closeDialog(): void {
    this.dialogRef.close();
  }

  // --- Internals ---

  /**
   * Byte window to request for one page, sized from the file's own average line length so a single
   * range request normally covers the whole page.
   */
  private get windowBytes(): number {
    const { size, lineCount } = this.data.file;
    const averageLineBytes = lineCount > 0 ? size / lineCount : FilePreviewDialogComponent.FALLBACK_LINE_BYTES;
    const estimate = Math.ceil(this.linesPerPage * averageLineBytes * FilePreviewDialogComponent.WINDOW_SLACK);

    return Math.min(
      Math.max(estimate, FilePreviewDialogComponent.MIN_WINDOW_BYTES),
      FilePreviewDialogComponent.MAX_WINDOW_BYTES
    );
  }

  private describeError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return error.status
        ? `Could not read the file (HTTP ${error.status}).`
        : 'Could not reach the backend to read the file.';
    }
    return error instanceof Error ? error.message : 'Could not read the file.';
  }

  private loadPage(position: PageTarget): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.previewService
      .loadPage({
        fileId: this.data.file.id,
        offset: position.offset,
        maxLines: this.linesPerPage,
        windowBytes: position.windowBytes ?? this.windowBytes,
        totalBytes: this.data.file.size,
        isLineAligned: position.isLineAligned,
        takeLastLines: position.takeLastLines ?? false
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (page) => {
          this.page = page;
          // Wherever the reader came from, a page starting at the first byte starts at the first line.
          this.firstLineNumber = page.startByte === 0 ? 1 : position.firstLineNumber;
          this.isLoading = false;
        },
        error: (error: unknown) => {
          this.errorMessage = this.describeError(error);
          this.isLoading = false;
        }
      });
  }
}
