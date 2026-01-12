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
  getItem(key: string): T | null {
    const decodedKey = this.decode(key);
    const storedValue = sessionStorage.getItem(decodedKey);
    if (!storedValue) {
      return null;
    }

    const storedData: StorageWrapper<T> = JSON.parse(storedValue);
    if (this.hasExpired(storedData)) {
      sessionStorage.removeItem(decodedKey);
      return null;
    }

    return storedData.value;
  }

  setItem(key: string, value: T, expiresInMs: number): void {
    const payload: StorageWrapper<T> = {
      expires: expiresInMs ? Date.now() + expiresInMs : 0,
      value
    };

    sessionStorage.setItem(this.decode(key), JSON.stringify(payload));
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(this.decode(key));
  }
}
