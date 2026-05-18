import { z } from 'zod';

import { TypedStorage } from '@services/storage/local-storage';

/**
 * Creates a fake native Storage backed by a plain Map.
 * This avoids any dependency on the browser or the global replacement logic.
 */
function fakeNativeStorage(): Storage {
  const map = new Map<string, string>();
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
    removeItem: (key: string) => {
      map.delete(key);
    },
    clear: () => map.clear(),
    key: (index: number) => [...map.keys()][index] ?? null,
    get length() {
      return map.size;
    },
    typed() {
      throw new Error('not applicable on native storage fake');
    }
  } as Storage;
}

describe('TypedStorage', () => {
  let native: Storage;

  beforeEach(() => {
    native = fakeNativeStorage();
  });

  // ── Backward-compatible (schema-free) mode ────────────────────────────

  describe('schema-free mode (backward compat)', () => {
    let storage: TypedStorage;

    beforeEach(() => {
      storage = new TypedStorage(native);
    });

    it('should store and retrieve a string value', () => {
      storage.setItem('key', 'hello');
      expect(storage.getItem('key')).toBe('hello');
    });

    it('should store and retrieve an object value', () => {
      const obj = { a: 1, b: [2, 3] };
      storage.setItem('key', obj);
      expect(storage.getItem('key')).toEqual(obj);
    });

    it('should return null for missing keys', () => {
      expect(storage.getItem('missing')).toBeNull();
    });

    it('should accept an explicit per-call schema on getItem', () => {
      const schema = z.object({ n: z.number() });
      storage.setItem('k', { n: 42 });
      const result = storage.getItem('k', schema);
      expect(result).toEqual({ n: 42 });
    });

    it('should accept an explicit per-call schema on setItem', () => {
      const schema = z.object({ n: z.number() });
      storage.setItem('k', { n: 5 }, schema);
      expect(storage.getItem('k')).toEqual({ n: 5 });
    });

    it('should self-heal on getItem when per-call schema fails', () => {
      storage.setItem('k', { n: 'not a number' });
      const schema = z.object({ n: z.number() });
      expect(storage.getItem('k', schema)).toBeNull();
      // Entry should be removed
      expect(native.getItem('k')).toBeNull();
    });

    it('should refuse to write on setItem when per-call schema fails', () => {
      spyOn(console, 'error');
      const schema = z.object({ n: z.number() });
      storage.setItem('k', { n: 'bad' } as unknown as { n: number }, schema);
      expect(native.getItem('k')).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  // ── Schema-bound mode ─────────────────────────────────────────────────

  describe('schema-bound mode', () => {
    const pointSchema = z.object({
      x: z.number(),
      y: z.number()
    });
    type Point = z.infer<typeof pointSchema>;

    let storage: TypedStorage<Point>;

    beforeEach(() => {
      storage = new TypedStorage<Point>(native, pointSchema);
    });

    it('getItem should validate using the constructor schema', () => {
      native.setItem('p', JSON.stringify({ x: 1, y: 2 }));
      const result = storage.getItem('p');
      expect(result).toEqual({ x: 1, y: 2 });
    });

    it('getItem should self-heal when constructor schema fails', () => {
      native.setItem('p', JSON.stringify({ x: 'bad', y: 2 }));
      expect(storage.getItem('p')).toBeNull();
      expect(native.getItem('p')).toBeNull();
    });

    it('getItem should strip unknown keys via constructor schema', () => {
      native.setItem('p', JSON.stringify({ x: 1, y: 2, z: 99 }));
      const result = storage.getItem('p');
      expect(result).toEqual({ x: 1, y: 2 });
    });

    it('setItem should validate using the constructor schema', () => {
      storage.setItem('p', { x: 10, y: 20 });
      expect(JSON.parse(native.getItem('p')!)).toEqual({ x: 10, y: 20 });
    });

    it('setItem should refuse invalid data via constructor schema', () => {
      spyOn(console, 'error');
      storage.setItem('p', { x: 'nope', y: 2 } as unknown as Point);
      expect(native.getItem('p')).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it('per-call schema should override the constructor schema', () => {
      const altSchema = z.object({ label: z.string() });
      native.setItem('l', JSON.stringify({ label: 'hi' }));
      // Explicitly passing a different schema overrides the default
      const result = storage.getItem('l', altSchema);
      expect(result).toEqual({ label: 'hi' });
    });
  });

  // ── typed() factory ───────────────────────────────────────────────────

  describe('typed() factory', () => {
    it('should create a schema-bound instance sharing the same native storage', () => {
      const base = new TypedStorage(native);
      const schema = z.object({ v: z.number() });
      const typed = base.typed(schema);

      // Write via typed instance
      typed.setItem('key', { v: 42 });
      // Read via base instance (no schema) — sees the same raw data
      expect(base.getItem('key')).toEqual({ v: 42 });
    });

    it('should validate reads through the typed schema', () => {
      const base = new TypedStorage(native);
      const schema = z.object({ v: z.number() });
      const typed = base.typed(schema);

      // Write invalid data through the base (no validation)
      base.setItem('key', { v: 'bad' });
      // Typed read should fail and self-heal
      expect(typed.getItem('key')).toBeNull();
      expect(native.getItem('key')).toBeNull();
    });

    it('should validate writes through the typed schema', () => {
      const base = new TypedStorage(native);
      const schema = z.object({ v: z.number() });
      const typed = base.typed(schema);

      spyOn(console, 'error');
      typed.setItem('key', { v: 'bad' } as unknown as { v: number });
      expect(native.getItem('key')).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  // ── defaultValue parameter ─────────────────────────────────────────────

  describe('defaultValue parameter', () => {
    let storage: TypedStorage;

    beforeEach(() => {
      storage = new TypedStorage(native);
    });

    it('should return defaultValue when key is missing', () => {
      const schema = z.object({ n: z.number() });
      const result = storage.getItem('missing', schema, { n: 0 });
      expect(result).toEqual({ n: 0 });
    });

    it('should return stored value (not default) when key exists and is valid', () => {
      const schema = z.object({ n: z.number() });
      storage.setItem('k', { n: 42 });
      const result = storage.getItem('k', schema, { n: 0 });
      expect(result).toEqual({ n: 42 });
    });

    it('should return defaultValue when schema validation fails', () => {
      const schema = z.object({ n: z.number() });
      storage.setItem('k', { n: 'bad' });
      const result = storage.getItem('k', schema, { n: -1 });
      expect(result).toEqual({ n: -1 });
      // Self-heal still removes the corrupt entry
      expect(native.getItem('k')).toBeNull();
    });

    it('should work with constructor schema and defaultValue', () => {
      const schema = z.object({ x: z.number() });
      const bound = new TypedStorage(native, schema);
      const result = bound.getItem('missing', undefined!, { x: 99 });
      expect(result).toEqual({ x: 99 });
    });
  });

  // ── Global replacement ──────────────────────────────────────────────

  describe('global replacement (side-effect import)', () => {
    it('should replace window.localStorage with a TypedStorage instance', () => {
      // The import at the top of this file triggers the global replacement
      expect(localStorage instanceof TypedStorage).toBe(true);
    });

    it('should support typed getItem/setItem through the global', () => {
      const schema = z.object({ n: z.number() });
      localStorage.setItem('__test_global', { n: 7 }, schema);
      const result = localStorage.getItem('__test_global', schema);
      expect(result).toEqual({ n: 7 });
      localStorage.removeItem('__test_global');
    });

    it('should support the typed() factory through the global', () => {
      const schema = z.object({ v: z.string() });
      const typed = localStorage.typed(schema);
      expect(typed).toBeInstanceOf(TypedStorage);
      typed.setItem('__test_typed', { v: 'hello' });
      expect(typed.getItem('__test_typed')).toEqual({ v: 'hello' });
      localStorage.removeItem('__test_typed');
    });
  });

  // ── Delegated methods ─────────────────────────────────────────────────

  describe('delegated methods', () => {
    let storage: TypedStorage;

    beforeEach(() => {
      storage = new TypedStorage(native);
    });

    it('removeItem should delegate to native', () => {
      native.setItem('k', '"v"');
      storage.removeItem('k');
      expect(native.getItem('k')).toBeNull();
    });

    it('clear should delegate to native', () => {
      native.setItem('a', '"1"');
      native.setItem('b', '"2"');
      storage.clear();
      expect(native.length).toBe(0);
    });

    it('key should delegate to native', () => {
      native.setItem('first', '"v"');
      expect(storage.key(0)).toBe('first');
      expect(storage.key(99)).toBeNull();
    });

    it('length should delegate to native', () => {
      expect(storage.length).toBe(0);
      native.setItem('a', '"1"');
      expect(storage.length).toBe(1);
    });
  });
});
