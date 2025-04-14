import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot
} from '@angular/router';
import { Perm } from '../_constants/userpermissions.config';
import { Injectable, inject } from '@angular/core';
import { Observable, map, take } from 'rxjs';

import { GlobalService } from 'src/app/core/_services/main.service';
import { AlertService } from '../_services/shared/alert.service';
import { SERV } from '../_services/main.config';
import { ResponseWrapper } from '@src/app/core/_models/response.model';
import { JUser } from '@src/app/core/_models/user.model';
import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard {
  isAuthenticated: boolean;

  constructor(
    private alert: AlertService,
    private gs: GlobalService,
    private serializer: JsonAPISerializer
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.gs
      .get(SERV.USERS, this.gs.userId, { include: ['globalPermissionGroup'] })
      .pipe(
        take(1),
        map((response: ResponseWrapper) => {

          const responseData = { data: response.data, included: response.included };
          const user = this.serializer.deserialize<JUser>(responseData);

          const permissions = user.globalPermissionGroup.permissions; //Check all permissions
          const permName = Perm[route.data['permission']].READ; //Get permission name
          const hasAccess = permissions[permName]; //returns true or false
          if (hasAccess || typeof hasAccess == 'undefined') {
            return true;
          }
          this.alert.okAlert(
            'ACCESS DENIED',
            'Please contact your Administrator.',
            'error'
          );
          return false;
        })
      );
  }
}

export const CheckPerm: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  return inject(PermissionGuard).canActivate(route, state);
};
