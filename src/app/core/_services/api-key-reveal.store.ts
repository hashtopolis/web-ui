import { Injectable } from '@angular/core';

/**
 * Single-use short time in memory store for passing a newly created JWT api token from the create screen to the reveal screen.
 * The key is only visible on creation (afterwards not accessible anymore), and will be consumed once on the reveal screen.
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
