import { Component, Input, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BaseModel, DynamicModel } from '@models/base.model';

import { ShowFullValueDialogComponent } from '@src/app/shared/dialog/show-full-value-dialog/show-full-value-dialog.component';
import { ShowFullValueDialogData } from '@src/app/shared/dialog/show-full-value-dialog/show-full-value-dialog.model';
import { truncateMiddle } from '@src/app/shared/utils/util';

/** Text up to this length is shown in full; longer values get a middle ellipsis. */
export const TABLE_TRUNCATE_MAX_LENGTH = 64;

/**
 * Component for displaying text truncated with a middle ellipsis.
 * Truncated text gets a button that opens a dialog showing the full text.
 */
@Component({
  selector: 'table-truncate',
  templateUrl: './table-truncate.component.html',
  standalone: false
})
export class TableTruncateComponent implements OnInit {
  private dialog = inject(MatDialog);

  @Input() text: string | BaseModel;
  @Input() path: string;
  @Input() maxLength = TABLE_TRUNCATE_MAX_LENGTH;
  @Input() endLength = 10;
  /** Title of the dialog showing the full text */
  @Input() dialogTitle: string | undefined;

  abbr: string;
  isTruncated = false;
  private fullText = '';

  ngOnInit(): void {
    this.fullText = typeof this.text === 'string' ? this.text : String((this.text as DynamicModel)[this.path] ?? '');

    this.abbr = truncateMiddle(this.fullText, this.maxLength, this.endLength);
    this.isTruncated = this.abbr !== this.fullText;
  }

  showFullText(): void {
    this.dialog.open<ShowFullValueDialogComponent, ShowFullValueDialogData>(ShowFullValueDialogComponent, {
      data: { title: this.dialogTitle ?? 'Full value', value: this.fullText }
    });
  }
}
