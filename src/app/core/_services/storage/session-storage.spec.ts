import { z } from 'zod';

import { TypedStorage } from '@services/storage/local-storage';
import '@services/storage/session-storage';

describe('session storage', () => {
  it('exposes the typed wrapper and validates stored values', () => {
    expect(window.sessionStorage).toBeInstanceOf(TypedStorage);
    const key = 'session-storage-spec';
    try {
      window.sessionStorage.setItem(key, { count: 3 });
      expect(window.sessionStorage.getItem(key, z.object({ count: z.number() }))).toStrictEqual({ count: 3 });
    } finally {
      window.sessionStorage.removeItem(key);
    }
  });
});
