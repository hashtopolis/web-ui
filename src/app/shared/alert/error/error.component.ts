import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

@Component({
  selector: 'app-timeout',
  templateUrl: './error.component.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule]
})
export class ErrorModalComponent {
  message: any;
  status?: number;

  constructor(
    public dialogRef: MatDialogRef<ErrorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.message = data.message;
      this.status = data.status;
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
