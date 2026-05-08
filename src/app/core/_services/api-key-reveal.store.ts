import { Injectable } from '@angular/core';

/**
 * Single-use in-memory carrier for a freshly-minted JWT.
 *
 * The backend only returns the actual token on the POST response; subsequent
 * reads never expose it. The create page stashes the secret here and immediately
 * navigates to the reveal page, which `consume()`s it once. We deliberately
 * don't persist or pass it via URL/history — a refresh on the reveal page must
 * fail closed (token gone, redirect to list).
 */
@Injectable({
  providedIn: 'root'
})
export class ApiKeyRevealStore {
  private token: string | null = null;

  set(token: string): void {
    this.token = token;
  }

  consume(): string | null {
    const value = this.token;
    this.token = null;
    return value;
  }
}
