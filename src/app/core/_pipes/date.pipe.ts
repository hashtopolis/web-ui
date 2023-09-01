import {
  Inject,
  LOCALE_ID,
  PipeTransform,
  Pipe
} from '@angular/core';
import { CookieService } from '../_services/shared/cookies.service';
import { dateFormat } from '../../core/_constants/settings.config';
import { DatePipe } from '@angular/common';

/**
 * Pipe to format date
 * @param epoch - Epoch date number
 * Usage:
 *   value | uiDate
 * Example:
 *   {{ 1694866300 | uiDate }}
 * @returns 16/09/2023
**/

@Pipe({
  name: 'uiDate'
})
export class uiDatePipe extends DatePipe implements PipeTransform {

  constructor(
    private cookieService: CookieService,
    @Inject(LOCALE_ID) locale: string
  ) { super(locale); }

  override transform(epoch: number):any {

    if(epoch === undefined  || epoch === null) return epoch;

    if(!this.cookieService.getCookie('localtimefmt')){
      this.cookieService.setCookie('localtimefmt', 'dd/MM/yyyy h:mm:ss', 365);
    }

    const format = this.checkFormat(this.cookieService.getCookie('localtimefmt'));

    return super.transform(epoch*1000, format);
  }

  //Check that format is correct
  checkFormat(format: any){
    let res; //Default date format
    for(let i=0; i < dateFormat.length; i++){
      if(dateFormat[i]['format']== format){
        res = format;
      }
    }
    if(!res){
      res = 'dd/MM/yyyy h:mm:ss';
      this.cookieService.setCookie('localtimefmt', res, 365);
    }
    return res;
  }

}

