import { Observable, map, take } from 'rxjs';
import { GlobalService } from 'src/app/core/_services/main.service';

import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';

import { JGlobalPermissionGroup } from '@models/global-permission-group.model';

import { SERV } from '@services/main.config';
import { AlertService } from '@services/shared/alert.service';

import { Perm } from '@src/app/core/_constants/userpermissions.config';
import { ResponseWrapper } from '@src/app/core/_models/response.model';
import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard {
  constructor(
    private alert: AlertService,
    private gs: GlobalService,
    private serializer: JsonAPISerializer
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.gs.ghelper(SERV.HELPER, 'getUserPermission').pipe(
      take(1),
      map((response: ResponseWrapper) => {
        const responseData = { data: response.data, included: response.included };
        const permissions = this.serializer.deserialize<JGlobalPermissionGroup>(responseData).permissions;
        const permName = Perm[route.data['permission']].READ; //Get permission name
        const hasAccess = permissions[permName]; //returns true or false
        if (hasAccess || typeof hasAccess == 'undefined') {
          return true;
        }
        this.alert.showErrorMessage('Access denied, please contact your Administrator.');
        return false;
      })
    );
  }
}

export const CheckPerm: CanActivateFn = (route: ActivatedRouteSnapshot): Observable<boolean> => {
  return inject(PermissionGuard).canActivate(route);
};
