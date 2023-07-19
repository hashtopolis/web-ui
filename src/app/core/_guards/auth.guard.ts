import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { map, take, of, Observable } from "rxjs";
import { AuthService } from "../_services/access/auth.service";

@Injectable({
  providedIn: 'root'
})
class AuthGuard {
    isAuthenticated: boolean;

    constructor(
      private authService: AuthService,
      private router: Router
    ){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {
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
export const IsAuth: CanActivateFn = (route:ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  return inject(AuthGuard).canActivate(route,state);
}
