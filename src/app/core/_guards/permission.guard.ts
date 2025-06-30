import { Observable, map } from 'rxjs';

import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';

import { PermissionService } from '@services/permission/permission.service';
import { AlertService } from '@services/shared/alert.service';

import { PermissionResource } from '@src/app/core/_constants/userpermissions.config';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard {
  constructor(
    private alert: AlertService,
    private permissionService: PermissionService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const group = route.data['permission'] as PermissionResource;

    return this.permissionService.hasPermission(group, 'READ').pipe(
      map((hasAccess) => {
        return true;
        /*
        if (hasAccess) {
          return true;
        }

        this.alert.showErrorMessage('Access denied, please contact your Administrator.');
        return false;
        */
      })
    );
  }
}

export const CheckPerm: CanActivateFn = (route: ActivatedRouteSnapshot): Observable<boolean> => {
  return inject(PermissionGuard).canActivate(route);
};
