import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';


describe('LocalStorageService', () => {
  let service: LocalStorageService<string | object>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageService,
      ]
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
    service.setItem(key, null, 1000);
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
});