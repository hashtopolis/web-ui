import { Injectable } from "@angular/core";
import { BaseStorageService } from "./base-storage.service";

export type SameSite = 'Lax' | 'None' | 'Strict';


/**
 * A storage service implementation that uses browser cookies to store and retrieve data
 * with optional expiration.
 *
 * @template T - The type of data to be stored.
 */
@Injectable({
  providedIn: 'root',
})
export class CookieStorageService<T> extends BaseStorageService<T> {

  static readonly SAME_SITE: SameSite = 'Lax'

  /**
   * Retrieves the stored data associated with the specified key from browser cookies.
   *
   * @param key - The key under which the data is stored.
   * @returns The stored data if found, or `null` if not found or expired.
   */
  getItem(key: string): T | null {
    key = this.decode(key);
    const value = this.getCookie(key);

    try {
      // Try parsing the value as JSON
      return JSON.parse(value) as T;
    } catch (e) {
      // If parsing fails, return the value as a plain string
      return value !== null ? value as T : null;
    }
  }

  /**
   * Stores data with an optional expiration time in browser cookies.
   *
   * @param key - The key under which to store the data.
   * @param value - The data to be stored.
   * @param expiresInMs - The optional expiration time in milliseconds.
   *                     If provided and greater than 0, the data will expire
   *                     after the specified time has passed.
   */
  setItem(key: string, value: T, expiresInMs: number): void {
    key = this.decode(key);
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);

    // Construct the cookie string with optional attributes
    let cookieString = `${key}=${serializedValue};sameSite=${CookieStorageService.SAME_SITE};`
    if (expiresInMs) {
      const expires = new Date(Date.now() + expiresInMs).toUTCString();
      cookieString += `expires=${expires};`;
    }

    document.cookie = cookieString
  }

  /**
   * Removes the stored data associated with the specified key from browser cookies.
   *
   * @param key - The key under which the data is stored.
   */
  removeItem(key: string): void {
    key = this.decode(key);
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
  }

  /**
   * Retrieves the raw cookie value associated with the specified key from browser cookies.
   *
   * @param key - The key under which the data is stored.
   * @returns The raw cookie value if found, or `null` if not found.
   */
  private getCookie(key: string): string | null {
    key = this.decode(key);
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
      const [cookieKey, cookieValue] = cookie.split('=').map((c) => c.trim());
      if (cookieKey === key) {
        return cookieValue;
      }
    }
    return null;
  }
}