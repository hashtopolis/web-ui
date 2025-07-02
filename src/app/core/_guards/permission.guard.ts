import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';

import { PermissionService } from '@services/permission/permission.service';
import { AlertService } from '@services/shared/alert.service';

import { PermissionValues } from '@src/app/core/_constants/userpermissions.config';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard {
  constructor(
    private alert: AlertService,
    private permissionService: PermissionService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredPermission = route.data['permission'] as PermissionValues;

    if (this.permissionService.hasPermissionSync(requiredPermission)) {
      return true;
    }

    let message: string;

    // Special case for permHashlistHashlist CRUD permissions with action in message
    const specialMatch = requiredPermission.match(/^permHashlistHashlist(Create|Read|Update|Delete)$/);
    if (specialMatch) {
      const action = specialMatch[1].toLowerCase();
      message = `You are not allowed to ${action} SuperHashlist`;
    } else {
      const match = requiredPermission.match(/^perm([A-Z][a-z]+)(Create|Read|Update|Delete)$/);

      if (match) {
        const resource = match[1];
        const action = match[2].toLowerCase();
        message = `You are not allowed to ${action} ${resource}`;
      } else {
        message = `missing permission: ${requiredPermission}`;
      }
    }

    this.alert.showErrorMessage(`Access denied: ${message}. Please contact your Administrator.`);
    return false;
  }
}


export const CheckPerm: CanActivateFn = (route: ActivatedRouteSnapshot): boolean => {
  return inject(PermissionGuard).canActivate(route);
};
