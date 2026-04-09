import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface ErrorModalData {
  message: string;
  status: number;
}

@Component({
    selector: 'app-timeout',
    templateUrl: './error.component.html',
    standalone: false
})
export class ErrorModalComponent {
  message: string;
  status?: number;

  constructor(
    public dialogRef: MatDialogRef<ErrorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorModalData
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
