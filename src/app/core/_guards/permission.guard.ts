import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';

import { PermissionService } from '@services/permission/permission.service';
import { AlertService } from '@services/shared/alert.service';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard {
  constructor(
    private alert: AlertService,
    private permissionService: PermissionService
  ) {}

  /**
   * Format human readable response from the permission enum values
   * @param perm Permission string value, e.g. "permAgentCreate"
   * @private
   */
  private formatPermissionName(perm: PermissionValues): string {
    type PermKey = keyof typeof Perm;

    for (const resourceKey of Object.keys(Perm) as PermKey[]) {
      const resourceEnum = Perm[resourceKey];
      for (const actionKey in resourceEnum) {
        if (resourceEnum[actionKey as keyof typeof resourceEnum] === perm) {
          const actionFormatted = actionKey.charAt(0).toUpperCase() + actionKey.slice(1).toLowerCase();
          return `${actionFormatted} ${resourceKey}`;
        }
      }
    }
    // fallback to raw string if no match found
    return perm;
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredPermission = route.data['permission'] as PermissionValues;

    if (this.permissionService.hasPermissionSync(requiredPermission)) {
      return true;
    }

    const formattedPermission = this.formatPermissionName(requiredPermission);
    const message = `You are not allowed to ${formattedPermission.toLowerCase()}`;

    this.alert.showErrorMessage(`Access denied: ${message}. Please contact your Administrator.`);
    return false;
  }
}

export const CheckPerm: CanActivateFn = (route: ActivatedRouteSnapshot): boolean => {
  return inject(PermissionGuard).canActivate(route);
};
