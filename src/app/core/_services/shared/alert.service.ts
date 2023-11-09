import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Injectable } from '@angular/core';

import { BulkService } from './bulk.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(
    private bulk: BulkService,
  ) {}

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
      timer: 2000,
      timerProgressBar: true,
    });
  }

  /**
   * Handles delete confirmation.
   * Displays a confirmation modal on the top end of the screen using library Sweet Alert
   *
   * @param {string} name - Item name
   * @param {string} title - Additional text
  */

  deleteConfirmation(name: string, title: string): Promise<boolean> {
    return Swal.fire({
      title: `Remove ${name} from your ${title}?`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: this.cancelButtonColor,
      confirmButtonColor: this.confirmButtonColor,
      confirmButtonText: this.delconfirmText
    }).then((result) => {
      return result.isConfirmed;
    });
  }

  /**
   * Bulk delete modal with progress bar
   * Uses a bulk action service to delete on bulk
   *
   * @param {array} items - Array of ids to be deleted
   * @param {string} text - Text to use in the display i.e Hashtypes
   * @param {string} path - API path call to delete the items on the array
   */

  bulkDeleteAlert(items: any[], text: string, path: string ) {
    this.bulk.setItems(items); // Items to be deleted
    this.bulk.setPath(path); //Path route
    Swal.fire({
      title: `Deleting ${items.length} ${text}`,
      html: '<div class="progress"><div class="progress-bar"></div></div>',
      showCancelButton: false,
      showConfirmButton: false,
      allowEscapeKey: false, //Dont let user escape modal until its finish
      allowOutsideClick: false,//Dont let user close modal until its finish
      didOpen: () => {
        const progressBar = Swal.getHtmlContainer().querySelector('.progress-bar');
        progressBar.style.width = '0%';

        this.bulk
          .performBulkDelete((percentage) => {
            progressBar.style.width = percentage + '%';
          })
          .then((success) => {
            if (success) {
              this.okAlert(`${items.length} ${text} deleted`,'')
            } else {
              Swal.update({
                icon: 'error',
                title: 'Error Deleting Items',
                showConfirmButton: true,
              });
            }
          })
          .catch((error) => {
            Swal.update({
              icon: 'error',
              title: 'Error Deleting Items',
              text: error.message,
              showConfirmButton: true,
            });
          });
      },
    });
  }

  /**
   * Bulk update modal with progress bar
   * Uses a bulk action service to delete on bulk
   *
   * @param {array} items - Array of ids to be deleted
   * @param {any} value - Value to be updated
   * @param {string} text - Text to use in the display i.e Hashtypes
   * @param {string} path - API path call to delete the items on the array
   */

    bulkUpdateAlert(items: any[], value: any, text: string, path: string ) {
      this.bulk.setItems(items); // Items to be deleted
      this.bulk.setValue(value);
      this.bulk.setPath(path); //Path route
      Swal.fire({
        title: `Updating ${items.length} ${text}`,
        html: '<div class="progress"><div class="progress-bar"></div></div>',
        showCancelButton: false,
        showConfirmButton: false,
        allowEscapeKey: false, //Dont let user escape modal until its finish
        allowOutsideClick: false,//Dont let user close modal until its finish
        didOpen: () => {
          const progressBar = Swal.getHtmlContainer().querySelector('.progress-bar');
          progressBar.style.width = '0%';

          this.bulk
            .performBulkUpdate((percentage) => {
              progressBar.style.width = percentage + '%';
            })
            .then((success) => {
              if (success) {
                this.okAlert(`${items.length} ${text} updated`,'')
              } else {
                Swal.update({
                  icon: 'error',
                  title: 'Error Updating Items',
                  showConfirmButton: true,
                });
              }
            })
            .catch((error) => {
              Swal.update({
                icon: 'error',
                title: 'Error Updating Items',
                text: error.message,
                showConfirmButton: true,
              });
            });
        },
      });
    }

}

