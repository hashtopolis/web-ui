import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DialogData } from '@src/app/shared/dialog/timeout/timeout-dialog.model';

@Component({
  selector: 'timeout-dialog',
  templateUrl: 'timeout-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class TimeoutDialogComponent {
  dialogRef = inject<MatDialogRef<TimeoutDialogComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
}
