import { UnsavedChangesService } from '../_services/shared/unsaved-changes.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CanDeactivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PendingChangesGuard
  implements CanDeactivate<CanComponentDeactivate>
{
  constructor(
    private unsavedChangesService: UnsavedChangesService,
    private router: Router
  ) {}

  async canDeactivate(component: CanComponentDeactivate): Promise<boolean> {
    const result = component.canDeactivate
      ? await this.handleDeactivation(component.canDeactivate())
      : true;

    return result;
  }

  private async handleDeactivation(
    deactivate: Observable<boolean> | Promise<boolean> | boolean
  ): Promise<boolean> {
    if (deactivate instanceof Observable) {
      return await firstValueFrom(deactivate);
    } else {
      return deactivate;
    }
  }

  private handleDefault(): boolean {
    if (this.unsavedChangesService.hasUnsavedChanges()) {
      const userConfirmed = window.confirm(
        'You have unsaved changes. Press OK to leave without saving, or Cancel to stay and save.'
      );

      if (userConfirmed) {
        // User clicked OK, navigate away
        this.unsavedChangesService.setUnsavedChanges(false);
        this.router.navigate(['/']); // Adjust this route as needed
        return true;
      } else {
        // User canceled, stay on the current page
        return false;
      }
    }

    return true;
  }
}
