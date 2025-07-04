import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { LocalStorageService } from '@services/storage/local-storage.service';

/**
 * This service redirects the user to the dashboard, if current logged-in user is another user then the last logged in
 * user and uses LocalStorageService to keep track of current and last logged-in user.
 *
 * The service is meant to be used after successful login in the login workflow.
 */
@Injectable({ providedIn: 'root' })
export class LoginRedirectService {
  private readonly LAST_USER_KEY = 'lastLoggedInUser';

  constructor(
    private router: Router,
    private localStorage: LocalStorageService<string>
  ) {}

  /**
   * Redirect to redirect URL, if current and last user are the same, otherwise redirect to dashboard
   * @param userId ID of current user
   * @param redirectUrl Redirect URL used if current user is the same as the last logged-in user
   */
  handlePostLoginRedirect(userId: string, redirectUrl: string): void {
    const lastUser = this.localStorage.getItem(this.LAST_USER_KEY);

    this.localStorage.setItem(this.LAST_USER_KEY, userId, 0);

    if (lastUser === userId && redirectUrl) {
      void this.router.navigate([redirectUrl]);
    } else {
      void this.router.navigate(['/']);
    }
  }
}
