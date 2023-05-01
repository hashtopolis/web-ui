import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {

  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    // if there are no pending changes, just allow deactivation; else confirm first
    return component.canDeactivate() ?
      true :
      Swal.fire({
        title: "WARNING",
        text: "You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        showCancelButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          return true;
        } else {
          return false
        }
      });
  }

}
