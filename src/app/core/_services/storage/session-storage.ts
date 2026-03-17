import { TypedStorage } from '@services/storage/local-storage';

// replace builtin session storage with a typesafe wrapper that optionally takes a schema and validates against it
if (typeof window !== 'undefined' && window.sessionStorage) {
  const nativeStorage: Storage = window.sessionStorage;
  const typedStorage = new TypedStorage(nativeStorage);

  Object.defineProperty(window, 'sessionStorage', {
    value: typedStorage,
    configurable: true,
    writable: false
  });
}
