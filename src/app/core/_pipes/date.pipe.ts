import { Pipe, PipeTransform, inject } from '@angular/core';

import { UIConfig } from '@models/config-ui.model';

import { LocalStorageService } from '@services/storage/local-storage.service';

import { UISettingsUtilityClass } from '@src/app/shared/utils/config';
import { TimePrecision, formatUnixTimestamp } from '@src/app/shared/utils/datetime';

/**
 * Pipe to format an epoch timestamp as a date and time, in the formats configured in the UI settings.
 * @param epoch - Epoch date number
 * Usage:
 *   value | uiDate
 * Example:
 *   {{ 1694866300 | uiDate }}
 * @returns 16/09/2023 14:51:40
 **/

@Pipe({
  name: 'uiDate',
  standalone: false
})
export class uiDatePipe implements PipeTransform {
  private uiSettings = new UISettingsUtilityClass(inject<LocalStorageService<UIConfig>>(LocalStorageService));

  transform(epoch: number | Date | string | null | undefined): string | null {
    if (epoch === undefined || epoch === null) return null;

    return formatUnixTimestamp(Number(epoch), this.uiSettings.getDateTimeFormat(TimePrecision.SECONDS));
  }
}
