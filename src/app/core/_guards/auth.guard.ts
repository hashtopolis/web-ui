import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, Observable, Subscription, take } from "rxjs";
import { AuthService } from "../_services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
    isAuthenticated: boolean;

    constructor(
      private authService: AuthService,
      private router: Router
    ){}

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>  {
        return this.authService.user.pipe(
            take(1),
            map(user =>{
            const isAuth = !!user;
            if(isAuth){
                return true;
            }
            return this.router.createUrlTree(['/auth'],{
              queryParams: { returnUrl: router.url }
            });
        }));
    }
}
