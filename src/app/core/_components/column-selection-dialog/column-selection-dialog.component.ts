import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-column-selection-dialog',
  templateUrl: './column-selection-dialog.component.html',
})
export class ColumnSelectionDialogComponent {
  availableColumns: string[];
  selectedColumns: string[];

  constructor(
    public dialogRef: MatDialogRef<ColumnSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { availableColumns: string[], selectedColumns: string[] }
  ) {
    // Initialize selectedColumns with the default columns
    this.selectedColumns = [...data.selectedColumns];
    this.availableColumns = [...data.availableColumns];
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}