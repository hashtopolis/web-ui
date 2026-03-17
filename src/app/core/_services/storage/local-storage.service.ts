import { z } from 'zod';

import { Injectable } from '@angular/core';

import { BaseStorageService, StorageWrapper } from '@services/storage/base-storage.service';

/**
 * A storage service implementation that uses browser's local storage to store and retrieve data
 * with optional expiration.
 *
 * @template T - The type of data to be stored.
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService<T> extends BaseStorageService<T> {
  /**
   * Retrieves the stored data associated with the specified key from local storage,
   * and checks if it has expired. If the data has expired, it is removed from local storage.
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
  getItem(key: string, schema: z.ZodType<T>, defaultValue: T): T;
  getItem(key: string, schema?: z.ZodType<T>): T | null;
  getItem(key: string, schema?: z.ZodType<T>, defaultValue?: T): T | null {
    key = this.decode(key);
    const storedData = localStorage.getItem<StorageWrapper<T>>(key);
    if (!storedData) {
      return defaultValue !== undefined ? structuredClone(defaultValue) : null;
    }

    if (this.hasExpired(storedData)) {
      // Data has expired, remove it from local storage.
      localStorage.removeItem(key);
      return defaultValue !== undefined ? structuredClone(defaultValue) : null;
    }

    const value = storedData.value;

    if (schema) {
      const result = schema.safeParse(value);
      if (!result.success) {
        console.error(`Schema validation failed for "${key}", using default:`, result.error.issues);
        // self heal, value is removed and the default value is used
        localStorage.removeItem(key);
        return defaultValue !== undefined ? structuredClone(defaultValue) : null;
      }
      return result.data;
    }

    return value;
  }

  /**
   * Stores data with an optional expiration time in local storage.
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
  setItem(key: string, value: T, expiresInMs: number, schema?: z.ZodType<T>): void {
    if (schema) {
      const result = schema.safeParse(value);
      if (!result.success) {
        console.error(`Storage write validation failed for key "${key}":`, result.error.issues);
        return;
      }
      value = result.data;
    }

    const storedValue: StorageWrapper<T> = {
      expires: expiresInMs ? new Date(Date.now() + expiresInMs).getTime() : 0,
      value: value
    };

    localStorage.setItem(this.decode(key), storedValue);
  }

  /**
   * Removes the stored data associated with the specified key from local storage.
   *
   * @param key - The key under which the data is stored.
   */
  removeItem(key: string): void {
    key = this.decode(key);
    localStorage.removeItem(key);
  }
}
