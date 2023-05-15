import { CookieService } from '../../_services/shared/cookies.service';
import { environment } from './../../../../environments/environment';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TooltipService {

  constructor(
    private cookieService: CookieService,
  ) {}

  public getTaskTooltips(){
     return environment.tooltip.tasks[this.getTooltipLevel()]
  }

  public getConfigTooltips(){
    return environment.tooltip.config[this.getTooltipLevel()]
  }

  public getTooltipLevel(){
    return this.cookieService.getCookie('tooltip');
  }


}


