import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, Observable, Subscription, take } from "rxjs";
import { AuthService } from "../_services/access/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
    isAuthenticated: boolean;

    constructor(
      private authService: AuthService,
      private router: Router
    ){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>  {
        return this.authService.user.pipe(
            take(1),
            map(user =>{
            const isAuth = !!user;
            if(isAuth){
                return true; // user authorised then return
            }
            this.authService.redirectUrl = state.url;
            this.router.navigate(['/auth']);
            return false;
        }));
    }
}
