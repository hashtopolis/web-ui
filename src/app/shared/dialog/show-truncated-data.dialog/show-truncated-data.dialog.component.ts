import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';

@Component({
  selector: 'app-show-truncated-data.dialog',
  imports: [MatDialogModule, MatButtonModule, ButtonsModule],
  templateUrl: './show-truncated-data.dialog.component.html',
  styleUrl: './show-truncated-data.dialog.component.scss'
})
export class ShowTruncatedDataDialogComponent {
  data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ShowTruncatedDataDialogComponent>);

  closeDialog(): void {
    this.dialogRef.close();
  }
}
