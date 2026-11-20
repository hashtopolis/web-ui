import { Observable, map, take } from 'rxjs';

import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '@services/access/auth.service';

@Injectable({
  providedIn: 'root'
})
class LoginGuard {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.authService.user.pipe(
      take(1),
      map((user) => {
        const isAuth = !!user;
        if (isAuth) {
          void this.router.navigate(['/']); // Redirect authenticated users to home
          return false; // Block access to login page
        }
        return true; // Allow access to login page
      })
    );
  }
}

/**
 * Allows anonymous users to reach login; redirects authenticated users home.
 */
export const redirectAuthenticatedUser: CanActivateFn = (): Observable<boolean> => {
  return inject(LoginGuard).canActivate();
};
