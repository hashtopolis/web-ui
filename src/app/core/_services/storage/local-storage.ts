import { z } from 'zod';

import { environment } from '@src/environments/environment';

/**
 * Typed wrapper around the native `Storage` API that replaces the global `localStorage`.
 *
 * Improvements over the native API:
 * - `getItem<T>()` returns the parsed value (JSON or raw string), not a raw string.
 * - `setItem<T>()` accepts any serializable value and an optional Zod schema for validation.
 * - Schema validation on read self-heals: corrupt entries are removed and `null` is returned.
 * - Schema validation on write refuses to persist invalid data.
 *
 * The global `window.localStorage` is replaced with an instance of this class at module
 * load time (see bottom of file). The TypeScript type is augmented via `declare global`
 * so the typed methods are available everywhere without imports.
 */
export class TypedStorage<T = unknown> {
  private readonly nativeStorage: Storage;
  private readonly defaultSchema?: z.ZodType<T>;

  constructor(native: Storage, schema?: z.ZodType<T>) {
    this.nativeStorage = native;
    this.defaultSchema = schema;
  }

  /**
   * Reads and auto-parses the value stored under `key`.
   *
   * - If the raw value is valid JSON, it is parsed.
   * - If not (e.g. a plain string stored by older code), it is returned as-is.
   * - When a Zod schema is provided, the parsed value is validated.
   *   On validation failure the key is removed (self-heal) and `null` is returned.
   */
  getItem<U>(key: string, schema: z.ZodType<U>, defaultValue: U): U;
  getItem<U>(key: string, schema: z.ZodType<U>): U | null;
  getItem(key: string): T | null;
  getItem<U>(key: string, schema?: z.ZodType<U>, defaultValue?: U): U | T | null {
    // Cast: native Storage.getItem always returns string | null.
    // The augmented Storage interface's generic overload would infer `unknown` here.
    const raw = this.nativeStorage.getItem(key) as string | null;
    if (raw === null) return defaultValue ?? null;

    let value: unknown;
    try {
      value = JSON.parse(raw);
    } catch {
      // Backward compat: value was stored as a plain string (not JSON-encoded).
      value = raw;
    }

    if (schema) {
      const result = schema.safeParse(value);
      if (!result.success) {
        console.warn(`Storage read validation failed for "${key}", use default value instead:`, result.error.issues);
        this.nativeStorage.removeItem(key);
        return defaultValue ?? null;
      }
      return result.data;
    }

    if (this.defaultSchema) {
      const result = this.defaultSchema.safeParse(value);
      if (!result.success) {
        console.warn(`Storage read validation failed for "${key}", use default value instead:`, result.error.issues);
        this.nativeStorage.removeItem(key);
        return defaultValue ?? null;
      }
      return result.data;
    }

    return value as U;
  }

  /**
   * Validates (if schema is provided) and stores `value` under `key`.
   *
   * - String values are stored raw (preserving native behavior and storage events).
   * - Non-string values are JSON-stringified automatically.
   * - If schema validation fails, the write is refused and an error is logged.
   */
  setItem<U = T>(key: string, value: U, schema?: z.ZodType<U>): void {
    const effectiveSchema = schema ?? this.defaultSchema;
    if (effectiveSchema) {
      const result = effectiveSchema.safeParse(value);
      if (!result.success) {
        if (!environment.production) {
          console.warn('value: ', value);
        }
        console.error(`Storage write validation failed for "${key}":`, result.error.issues);
        return;
      }
      value = result.data as U;
    }

    this.nativeStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  }

  /**
   * Creates a new schema-bound `TypedStorage` instance that shares this instance's
   * underlying native storage. Useful when `window.localStorage` is already our wrapper
   * and you want a typed view without double-wrapping.
   */
  typed<S>(schema: z.ZodType<S>): TypedStorage<S> {
    return new TypedStorage<S>(this.nativeStorage, schema);
  }

  removeItem(key: string): void {
    this.nativeStorage.removeItem(key);
  }

  clear(): void {
    this.nativeStorage.clear();
  }

  key(index: number): string | null {
    return this.nativeStorage.key(index);
  }

  get length(): number {
    return this.nativeStorage.length;
  }
}

// globally replace local storage with custom one that checks against a schema
if (typeof window !== 'undefined' && window.localStorage) {
  const nativeStorage: Storage = window.localStorage;
  const typedStorage = new TypedStorage(nativeStorage);

  Object.defineProperty(window, 'localStorage', {
    value: typedStorage,
    configurable: true,
    writable: false
  });
}

/**
 * Global type augmentation -> overwrites the localStorage type to require a schema
 * The global localStorage is replaced with a typesafe on startup
 */
declare global {
  interface Storage {
    /** Typed overload with default: returns `T` (never null) when a default is provided. */
    getItem<T>(key: string, schema: z.ZodType | undefined, defaultValue: T): T;
    /** Typed overload: parses JSON and returns `T`. */
    getItem<T>(key: string, schema?: z.ZodType): T | null;
    /** Typed overload: accepts any serialisable value, optionally validated by a Zod schema. */
    setItem<T>(key: string, value: T, schema?: z.ZodType): void;
    /** Creates a schema-bound TypedStorage sharing the same underlying native storage. */
    typed<S>(schema: z.ZodType<S>): TypedStorage<S>;
  }
}
