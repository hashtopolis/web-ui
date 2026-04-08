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
    const level = this.getTooltipLevel();
    return environment.tooltip.tasks[level as unknown as keyof typeof DEFAULT_CONFIG_TOOLTIP.tasks];
  }

  public getConfigTooltips(): ConfigTooltipsLevel {
    const level = this.getTooltipLevel();
    return environment.tooltip.config[level as unknown as keyof typeof DEFAULT_CONFIG_TOOLTIP.config];
  }

  public getTooltipLevel(): string {
    return this.cookieService.getCookie('tooltip');
  }
}
