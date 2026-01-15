import { TestBed } from '@angular/core/testing';

import { SessionStorageService } from '@services/storage/session-storage.service';

describe('SessionStorageService', () => {
  let service: SessionStorageService<string>;

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

  it('should return null for expired items', (done) => {
    const key = 'expiring-key';
    const value = 'expiring-value';

    service.setItem(key, value, 100); // Expires in 100ms

    setTimeout(() => {
      const result = service.getItem(key);
      expect(result).toBeNull();
      done();
    }, 150);
  });

  it('should not expire items with TTL=0 (indefinite)', () => {
    const key = 'indefinite-key';
    const value = 'indefinite-value';

    service.setItem(key, value, 0);
    const result = service.getItem(key);

    expect(result).toBe(value);
  });

  it('should handle complex objects as JSON string', () => {
    const key = 'object-key';
    const value = JSON.stringify({ name: 'test', count: 42 });

    service.setItem(key, value, 10000);
    const result = service.getItem(key);

    expect(result).toEqual(value);
    expect(JSON.parse(result!)).toEqual({ name: 'test', count: 42 });
  });
});
