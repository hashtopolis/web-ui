/* eslint-disable @angular-eslint/component-selector */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DialogData } from '@components/tables/table-dialog/table-dialog.model';

/**
 * A reusable Angular Material dialog component for displaying custom messages and actions.
 *
 * Usage:
 * ```
 *
 * openDialog() {
 *   const dialogRef = this.dialog.open(TableDialogComponent<HelloWorld>, {
 *     data: {
 *       title: 'Confirmation',
 *       body: 'Are you sure you want to continue?',
 *       action: 'confirm',
 *       rows: [{ hello: 'world' }]
 *     },
 *   });
 *
 *   dialogRef.afterClosed().subscribe(result => {
 *     if (result?.action === 'confirm') {
 *        // Perform the confirmation action here
 *     }
 *   });
 * }
 * ```
 * @template T - The type of data contained in the dialog.
 */
@Component({
  selector: 'table-dialog',
  templateUrl: 'table-dialog.component.html',
  standalone: false
})
export class TableDialogComponent<T> {
  /**
   * Creates an instance of TableDialogComponent.
   *
   * @param dialogRef - Reference to the MatDialogRef for managing the dialog.
   * @param data - Data used to configure the dialog's content and behavior.
   */
  constructor(
    public dialogRef: MatDialogRef<TableDialogComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<T>
  ) {}

  /**
   * Handles the click event on the "Cancel" button, closing the dialog.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
}
