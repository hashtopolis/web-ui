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
    const group = route.data['permission'] as PermissionValues;

    if (this.permissionService.hasPermissionSync(group)) {
      return true;
    }

    this.alert.showErrorMessage('Access denied, please contact your Administrator.');
    return false;
  }
}

export const CheckPerm: CanActivateFn = (route: ActivatedRouteSnapshot): boolean => {
  return inject(PermissionGuard).canActivate(route);
};
