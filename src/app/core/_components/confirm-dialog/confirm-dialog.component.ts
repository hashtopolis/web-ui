/**
 * Confirmaation dialog component
 */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  standalone: false
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  /**
   * Confirm button handler, sends true to afterClose handler
   */
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  /**
   * Cancel button handler, sends false to afterClose handler
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
