import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { map, Observable, take } from "rxjs";
import { Injectable } from "@angular/core";

import { UsersService } from "../_services/users/users.service";

@Injectable({
  providedIn: 'root'
})
export class HashlistGuard implements CanActivate{
    isAuthenticated: boolean;

    constructor(
      private users: UsersService,
      private router: Router
    ){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>  {
        return this.users.getUser(this.users.userId,{'expand':'globalPermissionGroup'}).pipe(
            take(1),
            map(perm =>{
            const isAuth = perm.globalPermissionGroup.permissions.viewHashlistAccess;
            if(isAuth || typeof isAuth == 'undefined'){
                return true;
            }
            Swal.fire({
              title: "ACCESS DENIED",
              text: "Please contact your Administrator.",
              icon: "error",
              showConfirmButton: false,
              timer: 2000
            })
            return false;
        }));
    }
}
