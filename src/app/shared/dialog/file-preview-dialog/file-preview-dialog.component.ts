import { Observable } from 'rxjs';

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
import { PreviewReader } from '@services/files/preview-reader';
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

/**
 * Pages through the contents of a stored wordlist or rules file without downloading it.
 *
 * Files here can be hundreds of gigabytes, so there is deliberately no page count and no jump to an
 * arbitrary page: the dialog walks forwards and backwards a page at a time and, when the file's
 * reader can seek, jumps to the two offsets that are knowable without reading the file — its start
 * and its end. A gzip-compressed file comes with a reader that cannot seek, since its contents are
 * only reachable by decompressing from the first byte onwards, so for it the end stays out of reach.
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
  protected readonly data: FilePreviewDialogData = inject(MAT_DIALOG_DATA);
  protected readonly pageSizes = FILE_PREVIEW_PAGE_SIZES;

  private readonly dialogRef = inject(MatDialogRef<FilePreviewDialogComponent>);
  private readonly previewService = inject(FilePreviewService);
  private readonly gs = inject(GlobalService);
  private readonly clipboard = inject(Clipboard);
  private readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);

  /** Reader on the file, of whichever kind its format allows, kept for the lifetime of the dialog. */
  private readonly reader: PreviewReader = this.previewService.openReader(this.data.file);

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

  /** Whether the reader can read at arbitrary offsets, which the jump to the end of the file needs. */
  protected get canSeek(): boolean {
    return this.reader.kind === 'seekable';
  }

  // --- Navigation ---

  protected showFirstPage(): void {
    this.trail = [];
    this.loadPage(this.reader.readForward(0, this.linesPerPage), 1);
  }

  protected showPreviousPage(): void {
    // Stepping back through pages already visited is exact, and keeps their line numbering.
    const previous = this.trail.pop();
    if (previous) {
      this.loadPage(this.reader.readForward(previous.offset, this.linesPerPage), previous.firstLineNumber);
      return;
    }

    // Nothing was paged through to get here, so reconstruct the page that ends where this one starts.
    // Only a seekable reader can do that; it is what makes the jump to the end of the file a place to
    // read from rather than a dead end.
    const current = this.page;
    if (!current || current.startByte === 0 || this.reader.kind !== 'seekable') {
      return;
    }
    this.loadPage(this.reader.readEndingAt(current.startByte, this.linesPerPage), null);
  }

  protected showNextPage(): void {
    const current = this.page;
    if (!current) {
      return;
    }
    this.trail.push({ offset: current.startByte, firstLineNumber: this.firstLineNumber });

    this.loadPage(
      this.reader.readNext(current, this.linesPerPage),
      // A page cut mid-line continues into the next one, so the line number no longer lines up.
      this.firstLineNumber === null || current.hasPartialLine ? null : this.firstLineNumber + current.lines.length
    );
  }

  protected showLastPage(): void {
    if (this.reader.kind !== 'seekable') {
      return;
    }
    this.trail = [];
    // Nothing here fixes which line of the file comes first: the page is filled backwards from the
    // end, and the file's reported line total counts terminators rather than lines. The byte position
    // tells the reader where they are instead.
    this.loadPage(this.reader.readLastLines(this.linesPerPage), null);
  }

  /** Reloads the page currently on screen at the newly chosen size, keeping the reader in place. */
  protected onPageSizeChange(): void {
    if (!this.page) {
      this.showFirstPage();
      return;
    }
    // A page sitting at the end of the file should stay there rather than drift forward off it, which
    // only a seekable reader can arrange; any other page reloads in place.
    if (!this.page.hasMore && this.reader.kind === 'seekable') {
      this.showLastPage();
      return;
    }
    this.loadPage(this.reader.readForward(this.page.startByte, this.linesPerPage), this.firstLineNumber);
  }

  // --- Template helpers ---

  protected get hasPreviousPage(): boolean {
    // Stepping back beyond the pages already walked means reconstructing one, which takes a seek.
    return this.trail.length > 0 || (this.canSeek && this.page !== null && this.page.startByte > 0);
  }

  protected get hasNextPage(): boolean {
    return this.page?.hasMore ?? false;
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
    if (!this.page || this.data.file.size === 0) {
      return 'empty file';
    }
    const { startByte, endByte } = this.page;
    const from = startByte.toLocaleString();
    const to = Math.max(endByte - 1, startByte).toLocaleString();

    switch (this.page.kind) {
      case 'plain': {
        const { totalBytes } = this.page;
        const percentage = ((endByte / totalBytes) * 100).toFixed(1);
        return `bytes ${from}–${to} of ${totalBytes.toLocaleString()} (${percentage}%)`;
      }
      case 'gzip': {
        // The decompressed total is unknowable until the whole archive has been fetched, so the label
        // reports where the reader stands and how much of the archive that took.
        const fetched = formatFileSize(this.page.compressedBytesFetched, 'short');
        return `decompressed bytes ${from}–${to} · ${fetched} of ${this.fileSizeLabel} fetched`;
      }
    }
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

  private describeError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return error.status
        ? `Could not read the file (HTTP ${error.status}).`
        : 'Could not reach the backend to read the file.';
    }
    return error instanceof Error ? error.message : 'Could not read the file.';
  }

  /**
   * Shows the page a read yields once it arrives.
   *
   * @param page$ - The read in progress.
   * @param firstLineNumber - 1-based number of the page's first line, or `null` when a seek made it
   *   unknowable.
   */
  private loadPage(page$: Observable<FilePreviewPage>, firstLineNumber: number | null): void {
    this.isLoading = true;
    this.errorMessage = '';

    page$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (page) => {
        this.page = page;
        // Wherever the reader came from, a page starting at the first byte starts at the first line.
        this.firstLineNumber = page.startByte === 0 ? 1 : firstLineNumber;
        this.isLoading = false;
      },
      error: (error: unknown) => {
        this.errorMessage = this.describeError(error);
        this.isLoading = false;
      }
    });
  }
}
