import { Injectable } from '@angular/core';

import { CookieService } from '@services/shared/cookies.service';

import { DEFAULT_CONFIG_TOOLTIP } from '@src/config/default/app/tooltip';
import { environment } from '@src/environments/environment';

// This gets the union of all task tooltip levels: tasks['0'] | tasks['1'] | tasks['2']
export type TaskTooltipsLevel = (typeof DEFAULT_CONFIG_TOOLTIP.tasks)[keyof typeof DEFAULT_CONFIG_TOOLTIP.tasks];

// Same for config, union of all config levels
export type ConfigTooltipsLevel = (typeof DEFAULT_CONFIG_TOOLTIP.config)[keyof typeof DEFAULT_CONFIG_TOOLTIP.config];

@Injectable({
  providedIn: 'root'
})
export class TooltipService {
  constructor(private cookieService: CookieService) {}

  public getTaskTooltips(): TaskTooltipsLevel {
    return environment.tooltip.tasks[this.getTooltipLevel()];
  }

  public getConfigTooltips(): ConfigTooltipsLevel {
    return environment.tooltip.config[this.getTooltipLevel()];
  }

  public getTooltipLevel() {
    return this.cookieService.getCookie('tooltip');
  }
}
