import { Component, inject } from '@angular/core';
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
  public dialogRef = inject<MatDialogRef<ErrorModalComponent>>(MatDialogRef);
  public data: ErrorModalData = inject(MAT_DIALOG_DATA);
  message: string = this.data?.message;
  status?: number = this.data?.status;

  onClose() {
    this.dialogRef.close();
  }
}
