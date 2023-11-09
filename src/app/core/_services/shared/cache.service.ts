import { Injectable } from '@angular/core';

/**
 * Service for caching values in memory.
 */
@Injectable({
  providedIn: 'root'
})
export class CacheService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static cache: Map<string, any> = new Map();

  /**
   * Retrieve a cached value by key.
   *
   * @param key - The unique key to retrieve the cached value.
   * @returns The cached value associated with the provided key, or undefined if not found.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static get(key: string): any {
    return this.cache.get(key);
  }

  /**
   * Set a cached value for a specified key.
   *
   * @param key - The unique key to associate with the cached value.
   * @param value - The value to cache.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  /**
   * Check if a cached value exists for a given key.
   *
   * @param key - The unique key to check for cached value existence.
   * @returns True if a cached value exists for the provided key, otherwise false.
   */
  static has(key: string): boolean {
    return this.cache.has(key);
  }
}