import { z } from 'zod';

import { TestBed, fakeAsync, tick } from '@angular/core/testing';

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
      expect(result['extra']).toBeUndefined();
    });
  });
});
