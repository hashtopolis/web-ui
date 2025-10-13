import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../_services/access/auth.service";
import { map, take, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
class AuthGuard {
    isAuthenticated: boolean;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.user.pipe(
        take(1),
        map(user => {
        const isAuth = !!user;
        if (isAuth) {
            this.router.navigate(['/']); // Redirect authenticated users to home
            return false; // Block access to login page
        }
        return true; // Allow access to login page
        })
    );
    };
}

export const IsAuth: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  return inject(AuthGuard).canActivate(route, state);
}
