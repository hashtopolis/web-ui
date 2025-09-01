import { environment } from 'src/environments/environment';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  /**
   * Get the API endpoint from the environment configuration
   * @returns {string} The API endpoint URL
   */
  public getEndpoint(): string {
    let apiEndpoint = environment.config.prodApiEndpoint;

    // Remove trailing slash for URL consistency
    if (apiEndpoint.endsWith('/')) {
      apiEndpoint = apiEndpoint.slice(0, -1);
    }

    return apiEndpoint;
  }
}
