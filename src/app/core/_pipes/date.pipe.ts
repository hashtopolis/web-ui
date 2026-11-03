import { Pipe, PipeTransform, inject } from '@angular/core';

import { UiSettingsService } from '@services/shared/ui-settings.service';

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
  private uiSettings = inject(UiSettingsService);

  transform(epoch: number | Date | string | null | undefined): string | null {
    if (epoch === undefined || epoch === null) return null;

    return formatUnixTimestamp(Number(epoch), this.uiSettings.getDateTimeFormat(TimePrecision.SECONDS));
  }
}
