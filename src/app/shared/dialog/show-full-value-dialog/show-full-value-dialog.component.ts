import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { ShowFullValueDialogData } from '@src/app/shared/dialog/show-full-value-dialog/show-full-value-dialog.model';

/**
 * Dialog showing the full, untruncated value of a table cell.
 */
@Component({
  selector: 'app-show-full-value-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './show-full-value-dialog.component.html'
})
export class ShowFullValueDialogComponent {
  data = inject<ShowFullValueDialogData>(MAT_DIALOG_DATA);
}
