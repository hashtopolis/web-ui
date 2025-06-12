/**
 * Service for confirmation dialog handling
 */
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmDialogComponent, ConfirmDialogData } from '@components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) {}

  /**
   * Opens a confirmation dialog containing two buttons
   * @param data - dialog data to be rendered in html component
   * @return Observable containing a boolean: true: action confirmed, false: action cancelled
   * @private
   */
  private openDialog(data: ConfirmDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data
    });

    return dialogRef.afterClosed();
  }

  /**
   * Opens a dialog to confirm deletion of an object
   * @param title - title of the deletion object
   * @param name - name of the object to delete
   * @return Observable containing a boolean: true: deletion confirmed, false: deletion cancelled
   */
  confirmDeletion(title: string, name: string): Observable<boolean> {
    const data: ConfirmDialogData = {
      title: `Delete ${title}`,
      message: `Are you sure you want to delete the ${title} ${name}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    };

    return this.openDialog(data);
  }
}
