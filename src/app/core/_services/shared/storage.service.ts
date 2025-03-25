import { Injectable } from '@angular/core';

import { environment } from '@src/environments/environment';

import { JConfig } from '@models/configs.model';
import { ResponseWrapper } from '@models/response.model';

import { GlobalService } from '@services/main.service';
import { JsonAPISerializer } from '@services/api/serializer-service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { SERV } from '@services/main.config';

@Injectable({
  providedIn: 'root'
})
export class UIConfigService {
  defaultSettings = false;
  cachevar = [
    // {name:'timefmt'},
    { name: 'hashcatBrainEnable' },
    { name: 'hashlistAlias' },
    { name: 'blacklistChars' },
    { name: 'chunktime' },
    { name: 'agentStatLimit' },
    { name: 'agentStatTension' },
    { name: 'agentTempThreshold1' },
    { name: 'agentTempThreshold2' },
    { name: 'agentUtilThreshold1' },
    { name: 'agentUtilThreshold2' },
    { name: 'statustimer' },
    { name: 'agenttimeout' },
    { name: 'maxSessionLength' }
  ];
  cexprity: number = 72 * 60 * 60; // Hours*minutes*Seconds Default: 72 hours
  private maxResults = environment.config.prodApiMaxResults;

  constructor(private gs: GlobalService) {}

  public checkStorage() {
    const defaults = JSON.parse(localStorage.getItem('uis'));
    if (defaults) {
      //Change to !defaults
      this.checkExpiry();
      return this.defaultSettings;
    } else if (!defaults) {
      this.storeDefault();
      this.defaultSettings = true;
    }
    return '';
  }

  public checkExpiry() {
    const timestamp = this.getUIsettings('_timestamp').value || 0;
    const expires = this.getUIsettings('_expiresin').value || 0;
    if (Date.now() - timestamp < expires) {
      this.storeDefault();
    }
  }

  public storeDefault() {
    const params = new RequestParamBuilder().setPageSize(this.maxResults).create();
    this.gs.getAll(SERV.CONFIGS, params).subscribe((response: ResponseWrapper) => {
      const configs = new JsonAPISerializer().deserialize<JConfig[]>({
        data: response.data,
        included: response.included
      });
      const post_data = [];
      this.cachevar.forEach((data) => {
        const name = data.name;
        let value: any = configs.find((config) => config.item === data.name);
        value = { name: name, value: value.value };
        post_data.push(value);
      });
      const timeinfo = [
        { name: '_timestamp', value: Date.now() },
        { name: '_expiresin', value: this.cexprity }
      ];

      localStorage.setItem('uis', JSON.stringify([].concat(post_data, timeinfo)));
    });
  }

  public onUpdatingCheck(name: any) {
    if (this.cachevar.some((e) => e.name === name)) {
      this.storeDefault();
    }
  }

  public getUIsettings(name?: string) {
    const uiconfig = JSON.parse(localStorage.getItem('uis'));
    if (!uiconfig) {
      return null;
    }
    return uiconfig.find((o) => o.name === name);
  }
}
