import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Shows a success message
   * @param message - message to display
   */
  showSuccessMessage(message: string) {
    this.showToast(message, 'snackbar-success');
  }

  /**
   * Shows an error message
   * @param message - error message to display
   */
  showErrorMessage(message: string) {
    this.showToast(message, 'snackbar-error');
  }

  /**
   * Shows an info message
   * @param message - info message to display
   */
  showInfoMessage(message: string) {
    this.showToast(message, 'snackbar-info', 5000);
  }

  /**
   * Shows a toast like message for 10 seconds in the upper left corner using a material snackbar
   * @param message - message to display
   * @param panelClass - CSS class for the  snackbar component
   * @param timeout - time in milliseconds to show the message
   * @private
   */
  private showToast(message: string, panelClass: string, timeout: number = 10000): void {
    this.snackBar.open(message, 'Close', {
      duration: timeout,
      panelClass: panelClass,
      horizontalPosition: 'start'
    });
  }
}
