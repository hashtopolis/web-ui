import { Injectable } from '@angular/core';

import { UiSetting, UiSettingName, uisCacheNames, uisSchema } from '@models/config-ui.schema';
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
    const defaults = localStorage.getItem<UiSetting[]>('uis', uisSchema);
    if (defaults) {
      this.checkExpiry();
      return;
    }
    this.storeDefault();
    this.defaultSettings = true;
  }

  public checkExpiry(): void {
    const uiconfig = localStorage.getItem<UiSetting[]>('uis', uisSchema);
    if (!uiconfig) return;
    const timestamp = Number(uiconfig.find((o) => o.name === '_timestamp')?.value) || 0;
    const expires = Number(uiconfig.find((o) => o.name === '_expiresin')?.value) || 0;
    if (Date.now() - timestamp > expires) {
      this.storeDefault();
    }
  }

  public storeDefault(): void {
    const params = new RequestParamBuilder().setPageSize(this.maxResults).create();
    this.gs.getAll(SERV.CONFIGS, params).subscribe((response: ResponseWrapper) => {
      const configs = new JsonAPISerializer().deserialize<JConfig[]>({
        data: response.data,
        included: response.included
      });
      const post_data: UiSetting[] = this.cachevar.map((name) => {
        const config = configs.find((c) => c.item === name);
        return { name, value: config?.value };
      });
      const timeinfo: UiSetting[] = [
        { name: '_timestamp', value: Date.now() },
        { name: '_expiresin', value: this.cexprity }
      ];

      localStorage.setItem<UiSetting[]>('uis', [...post_data, ...timeinfo], uisSchema);
    });
  }

  public onUpdatingCheck(name: string): void {
    if (this.cachevar.some((v) => v === name)) {
      this.storeDefault();
    }
  }

  // @TYPING @TODO maybe migrate UiSetting from list of UiSetting into object
  public getUIsettings(name: UiSettingName): UiSetting | undefined {
    const uiconfig = localStorage.getItem<UiSetting[]>('uis', uisSchema);
    if (!uiconfig) {
      return undefined;
    }
    return uiconfig.find((o) => o.name === name);
  }
}
