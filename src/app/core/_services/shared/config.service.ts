import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Interface for the expected shape of `assets/config.json`.
 */
interface AppConfig {
  hashtopolis_backend_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configUrl = 'assets/config.json';

  constructor(private http: HttpClient) {}

  /**
   * Retrieves the configuration file once from the assets folder.
   *
   * - In **production**, this fetches `assets/config.json` (created at container startup).
   * - In **development**, this bypasses the HTTP request and just returns `null`,
   *   because dev uses `environment.ts` instead of `config.json`.
   *
   * @returns An observable of the parsed JSON config (prod) or `null` (dev).
   */
  private getConfigOnce(): Observable<AppConfig> {
    if (!environment.production) {
      return of(null);
    }
    return this.http.get(this.configUrl);
  }

  /**
   * Refreshes the API endpoint configuration.
   *
   * - In **production**, it tries to read `hashtopolis_backend_url` from `config.json`.
   *   If found, it is saved to `localStorage`.
   *   If missing or invalid, falls back to `environment.config.prodApiEndpoint`.
   *
   * - In **development**, it always uses `environment.config.prodApiEndpoint`
   *   and stores it in `localStorage`.
   */
  public refreshEndpoint(): void {
    let ApiEndPoint = '';
    this.getConfigOnce().subscribe({
      next: (config) => {
        if (config && config.hashtopolis_backend_url) {
          ApiEndPoint = config.hashtopolis_backend_url;
          if (ApiEndPoint.endsWith('/')) {
            ApiEndPoint = ApiEndPoint.slice(0, -1);
          }
        } else {
          ApiEndPoint = environment.config.prodApiEndpoint;
        }
        localStorage.setItem('prodApiEndpoint', ApiEndPoint);
      },
      error: () => {
        ApiEndPoint = environment.config.prodApiEndpoint;
        localStorage.setItem('prodApiEndpoint', ApiEndPoint);
      }
    });
  }

  /**
   * Retrieves the currently configured API endpoint.
   *
   * - If an endpoint is already stored in `localStorage`, returns it.
   * - If not, it triggers `refreshEndpoint()` to initialize it and then returns
   *   either the stored value or falls back to `environment.config.prodApiEndpoint`.
   *
   * @returns The active API endpoint as a string.
   */
  public getEndpoint(): string {
    let ApiEndPoint = localStorage.getItem('prodApiEndpoint');
    if (!ApiEndPoint) {
      this.refreshEndpoint();
      ApiEndPoint = localStorage.getItem('prodApiEndpoint');
    }
    return ApiEndPoint ?? environment.config.prodApiEndpoint;
  }
}
