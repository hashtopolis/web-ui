import { Injectable } from '@angular/core';

import { UiSettings, UisCacheName, uisCacheNames, uisSettingsSchema } from '@models/config-ui.schema';
import { JConfig } from '@models/configs.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { environment } from '@src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UIConfigService {
  defaultSettings = false;
  cachevar = uisCacheNames;
  cexprity: number = 72 * 60 * 60 * 1000; // Default: 72 hours in milliseconds
  private maxResults = environment.config.prodApiMaxResults;

  constructor(private gs: GlobalService) {}

  public checkStorage(): void {
    const settings = localStorage.getItem<UiSettings>('uis', uisSettingsSchema);
    if (settings) {
      // Write back to persist migrated format (no-op if already object format)
      localStorage.setItem<UiSettings>('uis', settings, uisSettingsSchema);
      this.checkExpiry();
      return;
    }
    this.storeDefault();
    this.defaultSettings = true;
  }

  public checkExpiry(): void {
    const settings = localStorage.getItem<UiSettings>('uis', uisSettingsSchema);
    if (!settings) return;
    if (Date.now() - settings._timestamp > settings._expiresin) {
      this.storeDefault();
    }
  }

  public storeDefault(): void {
    const params = new RequestParamBuilder().setPageSize(this.maxResults).create();
    this.gs.getAll(SERV.CONFIGS, params).subscribe({
      next: (response: ResponseWrapper) => {
        const configs = new JsonAPISerializer().deserialize<JConfig[]>({
          data: response.data,
          included: response.included
        });
        const raw = convertNameValueConfigPairs(configs, this.cachevar);
        raw['_timestamp'] = Date.now();
        raw['_expiresin'] = this.cexprity;

        const result = uisSettingsSchema.safeParse(raw);
        if (!result.success) {
          console.error('Failed to validate UI config settings from server:', result.error.issues);
          return;
        }

        localStorage.setItem<UiSettings>('uis', result.data, uisSettingsSchema);
      },
      error: (err: unknown) => {
        console.error('Failed to fetch UI config defaults:', err);
      }
    });
  }

  public onUpdatingCheck(name: UisCacheName): void {
    if (this.cachevar.some((v) => v === name)) {
      this.storeDefault();
    }
  }

  public getUISettings(): UiSettings | null {
    return localStorage.getItem<UiSettings>('uis', uisSettingsSchema);
  }
}

function convertNameValueConfigPairs(configs: JConfig[], keys: readonly string[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const name of keys) {
    result[name] = configs.find((c) => c.item === name)?.value;
  }
  return result;
}
