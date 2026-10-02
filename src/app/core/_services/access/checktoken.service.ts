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
   * Brings the session back up to date when the tab becomes visible again.
   *
   * A backgrounded tab is where the renewal timer is least reliable: browsers throttle timers in
   * hidden tabs, and a suspended machine does not run them at all. So rather than trusting the
   * timer, this renews on the way back in whenever the access token is at or past its expiry.
   *
   * The user is only sent back to the login form when the renewal itself fails, which means the
   * refresh cookie has expired or the session was revoked.
   */
  checkTokenValidity() {
    const userData = this.localStorageService.getItem(AuthService.STORAGE_KEY);
    if (!userData) {
      return;
    }

    if (!this.authService.isAccessTokenExpiring()) {
      return;
    }

    this.authService.refreshToken().subscribe({
      error: () => {
        this.alertService.showInfoMessage('Session expired, please log in again.');
        this.authService.logOut();
      }
    });
  }
}
