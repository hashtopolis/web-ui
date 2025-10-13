import { Observable, firstValueFrom } from 'rxjs';

import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PendingChangesGuard implements CanDeactivate<CanComponentDeactivate> {
  constructor() {}

  async canDeactivate(component: CanComponentDeactivate): Promise<boolean> {
    return component.canDeactivate ? await this.handleDeactivation(component.canDeactivate()) : true;
  }

  private async handleDeactivation(deactivate: Observable<boolean> | Promise<boolean> | boolean): Promise<boolean> {
    if (deactivate instanceof Observable) {
      return await firstValueFrom(deactivate);
    } else {
      return deactivate;
    }
  }
}
