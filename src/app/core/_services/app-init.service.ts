import { Injectable } from '@angular/core';

import { AuthService } from '@services/access/auth.service';

@Injectable({ providedIn: 'root' })
export class AppInitService {
  constructor(private auth: AuthService) {}

  /**
   * Call this on app start to ensure permissions are loaded, if user is already logged in
   */
  initializeApp() {
    this.auth.autoLogin();
  }
}
