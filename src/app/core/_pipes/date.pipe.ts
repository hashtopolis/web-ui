import { DatePipe } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

import { dateFormats } from '@constants/settings.config';
import { CookieService } from '@services/shared/cookies.service';

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
  name: 'uiDate',
  standalone: false
})
export class uiDatePipe extends DatePipe implements PipeTransform {
  constructor(
    private cookieService: CookieService,
    @Inject(LOCALE_ID) locale: string
  ) {
    super(locale);
  }

  override transform(epoch: number | Date | string | null | undefined, ...args: unknown[]): any {
    if (epoch === undefined || epoch === null) return epoch;

    if (!this.cookieService.getCookie('localtimefmt')) {
      this.cookieService.setCookie('localtimefmt', 'dd/MM/yyyy h:mm:ss', 365);
    }

    const format = this.checkFormat(this.cookieService.getCookie('localtimefmt'));

    return super.transform(Number(epoch) * 1000, format);
  }

  //Check that format is correct
  checkFormat(format: string | null) {
    let res; //Default date format
    for (let i = 0; i < dateFormats.length; i++) {
      if (dateFormats[i].value === format) {
        res = format;
      }
    }
    if (!res) {
      res = 'dd/MM/yyyy h:mm:ss';
      this.cookieService.setCookie('localtimefmt', res, 365);
    }
    return res;
  }
}
