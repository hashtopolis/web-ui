import { Subject, of, throwError } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { API_ENDPOINT_STORAGE_KEY, ConfigService } from '@services/shared/config.service';

import { environment } from '@src/environments/environment';

describe('ConfigService', () => {
  let service: ConfigService;
  let httpGet: ReturnType<typeof vi.fn>;
  const originalProduction = environment.production;
  const fallbackEndpoint = environment.config.prodApiEndpoint;

  beforeEach(() => {
    environment.production = false;
    httpGet = vi.fn().mockName('HttpClient.get').mockReturnValue(of({}));

    TestBed.configureTestingModule({
      providers: [ConfigService, { provide: HttpClient, useValue: { get: httpGet } }]
    });

    service = TestBed.inject(ConfigService);
  });

  afterEach(() => {
    localStorage.removeItem(API_ENDPOINT_STORAGE_KEY);
    environment.production = originalProduction;
  });

  it('should return the stored endpoint without making an HTTP request', () => {
    const storedEndpoint = 'https://api.hashtopolis.test';
    localStorage.setItem(API_ENDPOINT_STORAGE_KEY, storedEndpoint);

    const endpoint = service.getEndpoint();

    expect(endpoint).toBe(storedEndpoint);
    expect(httpGet).not.toHaveBeenCalled();
  });

  it('should use the environment endpoint in development without making an HTTP request', () => {
    const endpoint = service.getEndpoint();

    expect(endpoint).toBe(fallbackEndpoint);
    expect(localStorage.getItem(API_ENDPOINT_STORAGE_KEY)).toBe(fallbackEndpoint);
    expect(httpGet).not.toHaveBeenCalled();
  });

  it('should use the production endpoint from the config and remove its trailing slash', () => {
    environment.production = true;
    httpGet.mockReturnValue(of({ hashtopolis_backend_url: 'https://api.hashtopolis.test/' }));

    const endpoint = service.getEndpoint();

    expect(endpoint).toBe('https://api.hashtopolis.test');
    expect(httpGet).toHaveBeenCalledExactlyOnceWith('assets/config.json');
    expect(localStorage.getItem(API_ENDPOINT_STORAGE_KEY)).toBe('https://api.hashtopolis.test');
  });

  it('should fall back to the environment endpoint when the production config has no endpoint', () => {
    environment.production = true;
    httpGet.mockReturnValue(of({}));

    const endpoint = service.getEndpoint();

    expect(endpoint).toBe(fallbackEndpoint);
    expect(localStorage.getItem(API_ENDPOINT_STORAGE_KEY)).toBe(fallbackEndpoint);
  });

  it('should fall back to the environment endpoint when loading the production config fails', () => {
    environment.production = true;
    httpGet.mockReturnValue(throwError(() => new Error('Config request failed')));

    const endpoint = service.getEndpoint();

    expect(endpoint).toBe(fallbackEndpoint);
    expect(localStorage.getItem(API_ENDPOINT_STORAGE_KEY)).toBe(fallbackEndpoint);
  });

  it('should return the fallback while production config is pending, then store the loaded endpoint', () => {
    environment.production = true;
    const configResponse = new Subject<{ hashtopolis_backend_url?: string }>();
    httpGet.mockReturnValue(configResponse.asObservable());

    const endpoint = service.getEndpoint();

    configResponse.next({ hashtopolis_backend_url: 'https://api.hashtopolis.test' });

    expect(endpoint).toBe(fallbackEndpoint);
    expect(localStorage.getItem(API_ENDPOINT_STORAGE_KEY)).toBe('https://api.hashtopolis.test');
  });
});
