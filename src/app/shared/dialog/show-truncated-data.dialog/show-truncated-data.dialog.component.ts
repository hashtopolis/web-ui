import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AgentTemperatureInformationDialogData } from '../agent-temperature-information-dialog/agent-temperature-information-dialog.model';
import { JHash } from '@src/app/core/_models/hash.model';

@Component({
  selector: 'app-show-truncated-data.dialog',
  imports: [MatDialogModule, MatButtonModule],
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
