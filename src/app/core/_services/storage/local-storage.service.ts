import { Injectable } from "@angular/core";
import { BaseStorageService, StorageWrapper } from "./base-storage.service";

/**
 * A storage service implementation that uses browser's local storage to store and retrieve data
 * with optional expiration.
 *
 * @template T - The type of data to be stored.
 */
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService<T> extends BaseStorageService<T> {

  /**
   * Retrieves the stored data associated with the specified key from local storage,
   * and checks if it has expired. If the data has expired, it is removed from local storage.
   *
   * @param key - The key under which the data is stored.
   * @returns The stored data if found and not expired, or `null` if not found or expired.
   */
  getItem(key: string): T | null {
    key = this.decode(key)
    const storedValue = localStorage.getItem(key);
    if (!storedValue) {
      return null; // Data not found.
    }

    const storedData: StorageWrapper<T> = JSON.parse(storedValue);
    if (this.hasExpired(storedData)) {
      // Data has expired, remove it from local storage.
      localStorage.removeItem(key);
      return null;
    }

    return storedData.value;
  }

  /**
   * Stores data with an optional expiration time in local storage.
   *
   * @param key - The key under which to store the data.
   * @param value - The data to be stored.
   * @param expiresInMs - The optional expiration time in milliseconds.
   *                     If provided and greater than 0, the data will expire
   *                     after the specified time has passed.
   */
  setItem(key: string, value: T, expiresInMs: number): void {
    const storedValue: StorageWrapper<T> = {
      expires: new Date(Date.now() + expiresInMs).getTime(),
      value: value
    }

    localStorage.setItem(this.decode(key), JSON.stringify(storedValue));
  }

  /**
   * Removes the stored data associated with the specified key from local storage.
   *
   * @param key - The key under which the data is stored.
   */
  removeItem(key: string): void {
    key = this.decode(key)
    localStorage.removeItem(key);
  }
}