import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { AuthService } from '@services/access/auth.service';
import { PermissionService } from '@services/permission/permission.service';
import { AlertService } from '@services/shared/alert.service';

@Injectable({ providedIn: 'root' })
export class AppInitService {
  constructor(
    private permissionService: PermissionService,
    private auth: AuthService,
    private alertService: AlertService
  ) {}

  /**
   * Call this on app start to ensure permissions are loaded, if user is already logged in
   */
  async initializeApp(): Promise<void> {
    try {
      const isLoggedIn = this.auth.token !== 'notoken';

      if (isLoggedIn) {
        await firstValueFrom(this.permissionService.loadPermissions().pipe(take(1)));
      }
    } catch (err) {
      console.error('Error during app initialization:', err);
      this.alertService.showErrorMessage('Failed to initialize application permissions.');
      throw err;
    }
  }
}
