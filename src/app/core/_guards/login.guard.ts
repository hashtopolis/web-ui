import { Observable, map, take } from 'rxjs';

import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '@services/access/auth.service';

@Injectable({
  providedIn: 'root'
})
class AuthGuard {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated: boolean;

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.user.pipe(
      take(1),
      map((user) => {
        const isAuth = !!user;
        if (isAuth) {
          this.router.navigate(['/']); // Redirect authenticated users to home
          return false; // Block access to login page
        }
        return true; // Allow access to login page
      })
    );
  }
}

export const IsAuth: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  return inject(AuthGuard).canActivate(route, state);
};
