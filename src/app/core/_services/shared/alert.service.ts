import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor() {}

  cancelButtonColor = '#8A8584';
  confirmButtonColor = '#C53819';
  delconfirmText = 'Yes, delete it!';

  /**
   * Handles notification confirmation.
   * Displays a confirmation modal on the top end of the screen using library Sweet Alert
   *
   * @param {string} title - Title to be displayed
   * @param {string} text - Additional text
   * @param {string} type - Type of warning, default success
   */

  okAlert(title: string, text: string, type: 'success' | 'error' | 'warning' = 'success') {
    Swal.fire({
      title,
      text,
      icon: type,
      position: 'top-end',
      backdrop: false,
      toast: true,
      showConfirmButton: false,
      timer: 1500
    });
  }

}

