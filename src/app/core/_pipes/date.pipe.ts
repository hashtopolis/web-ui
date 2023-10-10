import { Inject, LOCALE_ID, PipeTransform, Pipe } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CookieStorageService } from '../_services/storage/cookie-storage.service';
import { UISettings, UiSettingsComponent } from 'src/app/account/settings/ui-settings/ui-settings.component';

/**
 * Custom Angular pipe for formatting dates based on user settings.
 *
 * Usage:
 *   value | uiDate
 *
 * Example:
 *   {{ 1694866300 | uiDate }}
 *
 * @returns Formatted date string, e.g., '16/09/2023'
 */
@Pipe({
  name: 'uiDate'
})
export class uiDatePipe extends DatePipe implements PipeTransform {

  settings: UISettings

  /**
   * Creates an instance of UiDatePipe.
   *
   * @param cookieService - The CookieStorageService for retrieving user interface settings.
   * @param locale - The locale ID used for date formatting.
   */
  constructor(cookieService: CookieStorageService<UISettings>, @Inject(LOCALE_ID) locale: string) {
    super(locale);
    this.settings = cookieService.getItem(UiSettingsComponent.COOKIE_NAME)
  }

  /**
   * Transforms an epoch timestamp into a formatted date string based on user settings.
   *
   * @param epoch - The epoch timestamp to be formatted.
   * @returns The formatted date string.
   */
  override transform(epoch: number): any {
    if (epoch === undefined || epoch === null) {
      return epoch;
    }

    let format: string = UiSettingsComponent.DEFAULT_LOCALTIMEFMT;
    if (this.settings) {
      format = this.settings.localtimefmt
    }

    return super.transform(epoch * 1000, format);
  }
}

