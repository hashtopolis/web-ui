import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-column-selection-dialog',
  templateUrl: './column-selection-dialog.component.html',
  standalone: false
})
export class ColumnSelectionDialogComponent {
  public dialogRef = inject(MatDialogRef<ColumnSelectionDialogComponent>);
  public data = inject<{
    availableColumns: { [key: number]: string };
    selectedColumns: string[];
  }>(MAT_DIALOG_DATA);

  availableColumns: Record<string, string>;
  selectedColumns: string[];

  constructor() {
    // Initialize selectedColumns with the default columns
    this.selectedColumns = [...this.data.selectedColumns.filter((row: string) => row !== '100' && row !== '200')];
    this.availableColumns = { ...this.data.availableColumns };
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getKeys(): string[] {
    return Object.keys(this.availableColumns);
  }
}
