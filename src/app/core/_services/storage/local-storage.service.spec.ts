import { z } from 'zod';

import { TestBed, fakeAsync, tick } from '@angular/core/testing';

// Side-effect: replaces window.localStorage with the typed wrapper so setItem/getItem
// work correctly in tests (same as the import in main.ts).
import '@services/storage/local-storage';

import { LocalStorageService } from '@services/storage/local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService<string | object>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService]
    });
    service = TestBed.inject(LocalStorageService);
  });

  // --- Test Methods ---

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve data in local storage', () => {
    const key = 'testKey';
    const value = 'testValue';

    service.setItem(key, value, 1000);
    const retrievedValue = service.getItem(key);

    expect(retrievedValue).toBe(value);
  });

  it('should remove data from local storage after expiration', fakeAsync(() => {
    const key = 'testKey';
    const value = 'testValue';

    service.setItem(key, value, 1); // Set with 1-millisecond expiration

    tick(2);

    const retrievedValue = service.getItem(key);
    expect(retrievedValue).toBeNull();
  }));

  it('should remove data from local storage when explicitly removed', () => {
    const key = 'testKey';
    const value = 'testValue';

    service.setItem(key, value, 1000);
    service.removeItem(key);

    const retrievedValue = service.getItem(key);
    expect(retrievedValue).toBeNull();
  });

  it('should handle invalid JSON data', () => {
    const key = 'invalidKey';
    const invalidValue = 'invalidJSON';

    service.setItem(key, invalidValue, 1000);
    const retrievedValue = service.getItem(key);

    // The stored value is not valid JSON, so it should be retrieved as-is
    expect(retrievedValue).toBe(invalidValue);
  });

  it('should handle null values', () => {
    const key = 'nullKey';

    // Store a null value
    service.setItem(key, null!, 1000);
    const retrievedValue = service.getItem(key);

    expect(retrievedValue).toBeNull();
  });

  it('should handle complex objects', () => {
    const key = 'objectKey';
    const complexObject = { name: 'John', age: 30, hobbies: ['reading', 'hiking'] };

    // Store a complex object
    service.setItem(key, complexObject, 1000);
    const retrievedValue = service.getItem(key);

    expect(retrievedValue).toEqual(complexObject);
  });

  it('should handle keys with special characters', () => {
    const key = 'specialKey@!$%^&*()_+';

    service.setItem(key, 'specialValue', 1000);
    const retrievedValue = service.getItem(key);

    expect(retrievedValue).toBe('specialValue');
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
      const key = 'schemaInvalid';
      // Write invalid data without schema validation
      service.setItem(key, { name: 123, count: 'bad' }, 1000);

      const result = service.getItem(key, testSchema);

      expect(result).toBeNull();
      // Verify the corrupt entry was removed
      expect(localStorage.getItem(key)).toBeNull();
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
      expect(localStorage.getItem(key)).toBeNull();
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

  describe('defaultValue reference isolation', () => {
    const pointSchema = z.object({ x: z.number(), y: z.number() });
    let svc: LocalStorageService<{ x: number; y: number }>;

    beforeEach(() => {
      svc = TestBed.inject(LocalStorageService) as unknown as LocalStorageService<{ x: number; y: number }>;
    });

    afterEach(() => svc.removeItem('__pt__'));

    it('should not share the defaultValue reference when key is missing', () => {
      const def = { x: 1, y: 2 };

      const result = svc.getItem('__pt__', pointSchema, def);
      result.x = 99;

      expect(def.x).toBe(1); // original must not be mutated
    });

    it('should not share the defaultValue reference when schema validation fails', () => {
      const def = { x: 1, y: 2 };
      svc.setItem('__pt__', { x: 'bad', y: 'bad' } as unknown as { x: number; y: number }, 1000);

      const result = svc.getItem('__pt__', pointSchema, def);
      result.x = 99;

      expect(def.x).toBe(1); // original must not be mutated
    });

    it('should not share the defaultValue reference when data has expired', fakeAsync(() => {
      const def = { x: 1, y: 2 };
      svc.setItem('__pt__', { x: 5, y: 6 }, 1);
      tick(2);

      const result = svc.getItem('__pt__', pointSchema, def);
      result.x = 99;

      expect(def.x).toBe(1); // original must not be mutated
    }));
  });
});
