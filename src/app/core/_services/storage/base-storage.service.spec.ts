import { BaseStorageService } from "./base-storage.service";

class MockStorageService<T> extends BaseStorageService<T> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItem(key: string): T | null {
    return null
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setItem(key: string, value: T, expiresInMs: number): void {
    // Do nothing
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeItem(key: string): void {
    // Do nothing
  }
}

describe('BaseStorageService', () => {
  let service: MockStorageService<string>;

  beforeEach(() => {
    service = new MockStorageService();
  });

  // --- Test Methods ---

  it('should decode a URL-encoded string', () => {
    const encodedString = 'Hello%20World';
    const decodedString = service.decode(encodedString);

    expect(decodedString).toBe('Hello World');
  });

  it('should return the original string if not URL-encoded', () => {
    const originalString = 'Hello World';
    const decodedString = service.decode(originalString);

    expect(decodedString).toBe(originalString);
  });

  it('should return true for an expired storage wrapper', () => {
    const expiredWrapper = { value: 'expired', expires: Date.now() - 1000 }; // Set expiration in the past
    const result = service.hasExpired(expiredWrapper);

    expect(result).toBe(true);
  });

  it('should return false for a valid (not expired) storage wrapper', () => {
    const validWrapper = { value: 'valid', expires: Date.now() + 1000 }; // Set expiration in the future
    const result = service.hasExpired(validWrapper);

    expect(result).toBe(false);
  });

  it('should return false for a wrapper with no expiration', () => {
    const noExpirationWrapper = { value: 'no expiration', expires: null };
    const result = service.hasExpired(noExpirationWrapper);

    expect(result).toBe(false);
  });
});