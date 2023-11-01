import { Injectable } from '@angular/core';

export interface StorageWrapper<T> {
  value: T
  expires: number
}

/**
 * Abstract base service for data storage with expiration.
 * Implementations of this service should provide methods for storing, retrieving,
 * and removing data with optional expiration.
 *
 * @template T - The type of data to be stored.
 */
@Injectable({
  providedIn: 'root',
})
export abstract class BaseStorageService<T> {

  /**
   * Retrieves the stored data associated with the specified key.
   *
   * @param key - The key under which the data is stored.
   * @returns The stored data if found, or `null` if not found or expired.
   */
  abstract getItem(key: string): T | null;

  /**
   * Stores data with an optional expiration time.
   *
   * @param key - The key under which to store the data.
   * @param value - The data to be stored.
   * @param expiresInMs - The optional expiration time in milliseconds.
   *                     If provided and greater than 0, the data will expire
   *                     after the specified time has passed.
   */
  abstract setItem(key: string, value: T, expiresInMs: number): void;

  /**
   * Removes the stored data associated with the specified key.
   *
   * @param key - The key under which the data is stored.
   */
  abstract removeItem(key: string): void;

  /**
   * Decodes a string that may be URL-encoded. If the input string is a valid
   * URL-encoded string, it is decoded; otherwise, it returns the original string.
   *
   * @param data - The string to decode, which may be URL-encoded.
   * @returns The decoded string if it was URL-encoded, or the original string if not.
   */
  decode(data: string): string {
    try {
      return decodeURIComponent(data);
    } catch {
      return data;
    }
  }

  /**
   * Checks if the provided storage wrapper has expired based on its expiration timestamp.
   *
   * @param wrapper - The storage wrapper containing data and an optional expiration timestamp.
   * @returns `true` if the wrapper has expired, or `false` if it is still valid or has no expiration timestamp.
   */
  hasExpired(wrapper: StorageWrapper<T>): boolean {
    return !!(wrapper.expires && wrapper.expires <= Date.now())
  }
}