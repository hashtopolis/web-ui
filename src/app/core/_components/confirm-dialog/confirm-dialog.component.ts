/**
 * Confirmaation dialog component
 */
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  standalone: false
})
export class ConfirmDialogComponent {
  public dialogRef = inject<MatDialogRef<ConfirmDialogComponent>>(MatDialogRef);
  public data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

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
