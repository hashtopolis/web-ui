import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Perm } from "../_constants/userpermissions.config";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Injectable, inject } from "@angular/core";
import { map, Observable, take } from "rxjs";

import { GlobalService } from 'src/app/core/_services/main.service';
import { AlertService } from "../_services/shared/alert.service";
import { SERV } from '../_services/main.config';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard {
    isAuthenticated: boolean;

    constructor(
      private alert: AlertService,
      private gs: GlobalService
    ){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {
      return this.gs.get(SERV.USERS,this.gs.userId,{'expand':'globalPermissionGroup'}).pipe(
            take(1),
            map(perm =>{
            const permissions = perm.globalPermissionGroup.permissions; //Check all permissions
            const permName = Perm[route.data['permission']].READ;  //Get permission name
            const hasAccess = permissions[permName];  //returns true or false
            if(hasAccess || typeof hasAccess == 'undefined'){
                return true;
            }
            this.alert.okAlert('ACCESS DENIED','Please contact your Administrator.','error');
            return false;
        }));
    }
}

export const CheckPerm: CanActivateFn = (route:ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  return inject(PermissionGuard).canActivate(route,state);
}
