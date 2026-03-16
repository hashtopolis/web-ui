import { Injectable } from '@angular/core';

import { UiSettings, uisCacheNames, uisSettingsSchema } from '@models/config-ui.schema';
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
        const settings: Record<string, unknown> = {};
        for (const name of this.cachevar) {
          settings[name] = configs.find((c) => c.item === name)?.value;
        }
        settings['_timestamp'] = Date.now();
        settings['_expiresin'] = this.cexprity;

        localStorage.setItem<UiSettings>('uis', settings as UiSettings, uisSettingsSchema);
      },
      error: (err: unknown) => {
        console.error('Failed to fetch UI config defaults:', err);
      }
    });
  }

  public onUpdatingCheck(name: string): void {
    if (this.cachevar.some((v) => v === name)) {
      this.storeDefault();
    }
  }

  public getUIsetting<K extends keyof UiSettings>(name: K): UiSettings[K] | undefined {
    const settings = localStorage.getItem<UiSettings>('uis', uisSettingsSchema);
    return settings?.[name];
  }
}
