import { Injectable } from '@angular/core';

import { AuthData } from '@models/auth-user.model';

import { AuthService } from '@services/access/auth.service';
import { AlertService } from '@services/shared/alert.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

@Injectable({ providedIn: 'root' })
export class CheckTokenService {
  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService<AuthData>,
    private alertService: AlertService
  ) {
    // We Listen using visibility api to look change events, tab inactive and active
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // When tab is now active; we check token validity and refresh if we have time
        this.checkTokenValidity();
      }
    });
  }

  /**
   * Checks the current user's token expiration date stored in localStorage.
   * If no user data is found, the method exits.
   * If the token is expired (less than 15 milliseconds remaining), the user is logged out.
   *
   * Intended usage:
   * - Called when the browser tab becomes visible (via the Visibility API listener).
   * - Can also be triggered manually to ensure session validity.
   *
   * Behavior:
   * - Reads `_token` and `_expires` from `userData` in localStorage.
   * - Calculates time remaining until expiration.
   * - Logs out the user immediately if the token is near expiry.
   * - Placeholder for token refresh logic when a refresh token system is implemented.
   */
  checkTokenValidity() {
    const userData = this.localStorageService.getItem(AuthService.STORAGE_KEY);
    if (!userData) {
      return;
    }
    const tokendate = new Date(userData._expires).getTime();
    const currentDate = new Date().getTime();
    const timeDifference = tokendate - currentDate;
    // We should be refreshing but when using refresh token, we get an error "Signature verification failure"
    // if(timeDifference > 0 && timeDifference <  600){
    //   console.log('trying to refresh token')
    //   this.authService.refreshToken().subscribe(
    //     (data) => {
    //        console.log(data)
    //     }
    //   );
    // }
    if (timeDifference < 15) {
      this.alertService.showInfoMessage('Token expired, please log in again.');
      this.authService.logOut();
    }
  }
}
