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

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.user.pipe(
      take(1),
      map((user) => {
        const isAuth = !!user;
        if (isAuth) {
          return true;
        }
        this.authService.redirectUrl = state.url;
        void this.router.navigate(['/auth']);
        return false;
      })
    );
  }
}

/**
 * Allows authenticated users; otherwise saves the requested URL and redirects to log in.
 */
export const requireAuth: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  return inject(AuthGuard).canActivate(route, state);
};
