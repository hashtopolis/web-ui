import Swal from 'sweetalert2/dist/sweetalert2.js';

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private snackBar: MatSnackBar) {}

  confirmButtonColor = '#C53819';
  okText = 'Ok';

  /**
   * Handles custom text confirmation.
   * Displays a confirmation modal on the top end of the screen using library Sweet Alert
   *
   * @param {string} name - Item name
   * @param {string} title - Additional text
   */
  errorConfirmation(text: string): Promise<boolean> {
    return Swal.fire({
      title: `${text}`,
      icon: 'error',
      showCancelButton: false,
      confirmButtonColor: this.confirmButtonColor,
      confirmButtonText: this.okText
    }).then((result) => {
      return result.isConfirmed;
    });
  }

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
