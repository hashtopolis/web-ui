import { ASC } from '@constants/agentsc.config';

import { Pipe, PipeTransform, inject } from '@angular/core';

import { UIConfigService } from '@services/shared/storage.service';

/**
 * Returns different hex color depending on thresholds and Agent type (Device Temperature, Device Utilisations, CPU Utilisation)
 * @param value - The input number value
 * Usage:
 *   value | asColor
 * Example:
 *   {{ 65 | asColor }}
 * @returns #b16a06
 **/

@Pipe({
  name: 'asColor',
  standalone: false
})
export class AgentSColorPipe implements PipeTransform {
  private uiService = inject(UIConfigService);

  transform(
    value: number | string,
    threshold1: number,
    threshold2: number,
    stattype: number,
    isActive: number | boolean,
    lastactivity: number
  ): string {
    if (!isActive) return '';
    if (value === 'No data') {
      if (isActive == 1 && Date.now() - lastactivity < this.gettime()) {
        return '#42d4f4';
      }
      return '#CCCCCC';
    }
    if (+value == 0) return '#FF0000';
    if (+value > threshold1 && (stattype == ASC.GPU_TEMP || stattype == ASC.CPU_UTIL)) return '#009933';
    else if (+value > threshold2 && (stattype == ASC.GPU_TEMP || stattype == ASC.CPU_UTIL)) return '#ff9900';
    if (+value <= threshold1 && stattype == ASC.GPU_UTIL) return '#009933';
    else if (+value <= threshold2 && stattype == ASC.GPU_UTIL) return '#ff9900';
    else return '#800000';
  }

  gettime() {
    return this.uiService.getUISettings()?.agenttimeout ?? 0;
  }
}
