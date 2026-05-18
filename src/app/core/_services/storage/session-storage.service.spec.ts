import { z } from 'zod';

import { TestBed, fakeAsync, tick } from '@angular/core/testing';

// Side-effect: replaces window.sessionStorage with the TypedStorage wrapper.
// Must run before any test touches sessionStorage so that setItem/getItem
// handle JSON serialisation automatically.
import '@services/storage/session-storage';

import { SessionStorageService } from '@services/storage/session-storage.service';

describe('SessionStorageService', () => {
  let service: SessionStorageService<string | object>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionStorageService]
    });
    service = TestBed.inject(SessionStorageService);
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve a value', () => {
    const key = 'test-key';
    const value = 'test-value';

    service.setItem(key, value, 10000);
    const result = service.getItem(key);

    expect(result).toBe(value);
  });

  it('should return null for non-existent keys', () => {
    const result = service.getItem('non-existent-key');
    expect(result).toBeNull();
  });

  it('should remove an item', () => {
    const key = 'test-key';
    const value = 'test-value';

    service.setItem(key, value, 10000);
    service.removeItem(key);

    const result = service.getItem(key);
    expect(result).toBeNull();
  });

  it('should return null for expired items', fakeAsync(() => {
    const key = 'expiring-key';
    const value = 'expiring-value';

    service.setItem(key, value, 1); // Expires in 1ms

    tick(2);

    const result = service.getItem(key);
    expect(result).toBeNull();
  }));

  it('should not expire items with TTL=0 (indefinite)', () => {
    const key = 'indefinite-key';
    const value = 'indefinite-value';

    service.setItem(key, value, 0);
    const result = service.getItem(key);

    expect(result).toBe(value);
  });

  it('should handle complex objects', () => {
    const key = 'object-key';
    const value = { name: 'test', count: 42 };

    service.setItem(key, value, 10000);
    const result = service.getItem(key);

    expect(result).toEqual(value);
  });

  // --- Schema validation tests ---

  describe('with schema validation', () => {
    const testSchema = z.object({
      name: z.string(),
      count: z.number()
    });

    it('getItem should return parsed value when schema matches', () => {
      const key = 'schemaValid';
      const value = { name: 'test', count: 42 };

      service.setItem(key, value, 1000);
      const result = service.getItem(key, testSchema);

      expect(result).toEqual(value);
    });

    it('getItem should remove key and return null when stored data fails schema', () => {
      spyOn(console, 'error');
      const key = 'schemaInvalid';
      // Write invalid data without schema validation
      service.setItem(key, { name: 123, count: 'bad' }, 1000);

      const result = service.getItem(key, testSchema);

      expect(result).toBeNull();
      // Verify the corrupt entry was removed
      expect(sessionStorage.getItem(key)).toBeNull();
    });

    it('setItem should write parsed value when schema matches', () => {
      const key = 'schemaWriteValid';
      const value = { name: 'hello', count: 7 };

      service.setItem(key, value, 1000, testSchema);
      const result = service.getItem(key);

      expect(result).toEqual(value);
    });

    it('setItem should refuse to write and log error when value fails schema', () => {
      const key = 'schemaWriteInvalid';
      spyOn(console, 'error');

      service.setItem(key, { name: 999, count: 'bad' }, 1000, testSchema);

      // Nothing should be stored
      expect(sessionStorage.getItem(key)).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it('getItem without schema should behave unchanged (backward compat)', () => {
      const key = 'noSchema';
      const value = { anything: true, goes: [1, 2, 3] };

      service.setItem(key, value, 1000);
      const result = service.getItem(key);

      expect(result).toEqual(value);
    });

    it('setItem without schema should behave unchanged (backward compat)', () => {
      const key = 'noSchemaWrite';
      const value = 'any string value';

      service.setItem(key, value, 1000);
      expect(service.getItem(key)).toBe(value);
    });

    it('getItem with schema should strip unknown keys (z.object default)', () => {
      const key = 'schemaStrip';
      service.setItem(key, { name: 'a', count: 1, extra: true }, 1000);

      const result = service.getItem(key, testSchema);

      expect(result).toEqual({ name: 'a', count: 1 });
      expect((result as Record<string, unknown>)['extra']).toBeUndefined();
    });
  });

  // --- defaultValue parameter tests ---

  describe('with defaultValue parameter', () => {
    const testSchema = z.object({
      name: z.string(),
      count: z.number()
    });

    const defaultObj = { name: 'default', count: 0 };

    it('getItem should return defaultValue when key does not exist', () => {
      const result = service.getItem('missing-key', testSchema, defaultObj);
      expect(result).toEqual(defaultObj);
    });

    it('getItem should return stored value (not default) when key exists and is valid', () => {
      const stored = { name: 'real', count: 42 };
      service.setItem('existing', stored, 1000);

      const result = service.getItem('existing', testSchema, defaultObj);
      expect(result).toEqual(stored);
    });

    it('getItem should return defaultValue when schema validation fails', () => {
      spyOn(console, 'error');
      service.setItem('bad', { name: 999, count: 'bad' }, 1000);

      const result = service.getItem('bad', testSchema, defaultObj);
      expect(result).toEqual(defaultObj);
      // corrupt entry should be self-healed (removed)
      expect(sessionStorage.getItem('bad')).toBeNull();
    });

    it('getItem should return defaultValue when item has expired', fakeAsync(() => {
      service.setItem('expiring', { name: 'gone', count: 1 }, 1); // 1ms TTL

      tick(2);

      const result = service.getItem('expiring', testSchema, defaultObj);
      expect(result).toEqual(defaultObj);
    }));

    it('getItem should return defaultValue without schema when key is missing', () => {
      const result = service.getItem('nope', undefined!, 'fallback');
      expect(result).toBe('fallback');
    });
  });

  // --- QuotaExceededError handling ---

  describe('QuotaExceededError handling', () => {
    it('should warn and not throw when sessionStorage quota is exceeded', () => {
      spyOn(console, 'warn');
      const quotaError = new DOMException('QuotaExceededError', 'QuotaExceededError');
      spyOn(sessionStorage, 'setItem').and.throwError(quotaError);

      expect(() => service.setItem('key', 'value', 1000)).not.toThrow();
      expect(console.warn).toHaveBeenCalledWith(jasmine.stringContaining('quota exceeded'));
    });

    it('should re-throw non-quota DOMExceptions', () => {
      const securityError = new DOMException('Access denied', 'SecurityError');
      spyOn(sessionStorage, 'setItem').and.throwError(securityError);

      expect(() => service.setItem('key', 'value', 1000)).toThrowError(DOMException);
    });
  });

  // --- URL-encoded key handling ---

  describe('URL-encoded keys', () => {
    it('should decode URL-encoded keys on store and retrieve', () => {
      const encodedKey = 'my%20key';
      service.setItem(encodedKey, 'value', 1000);

      const result = service.getItem(encodedKey);
      expect(result).toBe('value');
    });

    it('should treat non-encoded keys normally', () => {
      const key = 'plain-key';
      service.setItem(key, 'value', 1000);
      expect(service.getItem(key)).toBe('value');
    });
  });
});
