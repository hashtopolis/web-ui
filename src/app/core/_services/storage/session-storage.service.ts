import { z } from 'zod';

import { Injectable } from '@angular/core';

import { BaseStorageService, StorageWrapper } from '@services/storage/base-storage.service';

/**
 * Session-based storage with optional expiration. Data lives for the lifetime
 * of the current tab (sessionStorage) and is cleared automatically when the
 * tab is closed.
 */
@Injectable({
  providedIn: 'root'
})
export class SessionStorageService<T> extends BaseStorageService<T> {
  /**
   * Retrieves the stored data associated with the specified key from session storage,
   * and checks if it has expired. If the data has expired, it is removed from session storage.
   *
   * When a Zod schema is provided, the retrieved value is validated against it.
   * If validation fails, the corrupt entry is removed and `null` is returned
   * (callers typically fall back to defaults).
   *
   * @param key - The key under which the data is stored.
   * @param schema - Optional Zod schema to validate the stored value against.
   * @param defaultValue - Optional default value if the schema validation fails use that
   * @returns The stored data if found and not expired, or `null` if not found or expired.
   */
  getItem(key: string, schema: z.ZodType, defaultValue: T): T;
  getItem(key: string, schema?: z.ZodType): T | null;
  getItem(key: string, schema?: z.ZodType, defaultValue?: T): T | null {
    key = this.decode(key);
    const storedData = sessionStorage.getItem<StorageWrapper<T>>(key);
    if (!storedData) {
      return defaultValue ?? null;
    }

    if (this.hasExpired(storedData)) {
      sessionStorage.removeItem(key);
      return defaultValue ?? null;
    }

    const value = storedData.value;

    if (schema) {
      const result = schema.safeParse(value);
      if (!result.success) {
        console.error(`Schema validation failed for "${key}", using default:`, result.error.issues);
        sessionStorage.removeItem(key);
        return defaultValue ?? null;
      }
      return result.data as T;
    }

    return value;
  }

  /**
   * Stores data with an optional expiration time in session storage.
   *
   * When a Zod schema is provided, the value is validated before writing.
   * If validation fails, the write is refused and an error is logged.
   * On success, the parsed value (with defaults applied, unknowns stripped) is stored.
   *
   * @param key - The key under which to store the data.
   * @param value - The data to be stored.
   * @param expiresInMs - The optional expiration time in milliseconds.
   *                     If provided and greater than 0, the data will expire
   *                     after the specified time has passed.
   * @param schema - Optional Zod schema to validate the value before writing.
   */
  setItem(key: string, value: T, expiresInMs: number, schema?: z.ZodType): void {
    if (schema) {
      const result = schema.safeParse(value);
      if (!result.success) {
        console.error(`Cannot write to session storage as validation fails for "${key}":`, result.error.issues);
        return;
      }
      value = result.data as T;
    }

    const storedValue: StorageWrapper<T> = {
      expires: expiresInMs ? new Date(Date.now() + expiresInMs).getTime() : 0,
      value: value
    };

    sessionStorage.setItem(this.decode(key), storedValue);
  }

  removeItem(key: string): void {
    key = this.decode(key);
    sessionStorage.removeItem(key);
  }
}
