import { ASC } from '@constants/agentsc.config';

import { Pipe, PipeTransform, inject } from '@angular/core';

import { UIConfigService } from '@services/shared/storage.service';

/**
 * Returns a CSS color string for an agent stat (GPU temperature, GPU/CPU utilisation)
 * based on the value relative to the configured thresholds. Values are CSS
 * variables resolving through the design-system semantic ramp so they
 * follow theme + design switching automatically.
 * @param value - The input number value
 * Usage:
 *   value | asColor
 * Example:
 *   {{ 65 | asColor }}
 * @returns 'var(--success)' | 'var(--warning)' | 'var(--destructive)' | …
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
        return 'var(--info)';
      }
      return 'var(--subtle-foreground)';
    }
    if (+value == 0) return 'var(--destructive)';
    if (+value > threshold1 && (stattype == ASC.GPU_UTIL || stattype == ASC.CPU_UTIL)) return 'var(--success)';
    else if (+value > threshold2 && (stattype == ASC.GPU_UTIL || stattype == ASC.CPU_UTIL)) return 'var(--warning)';
    if (+value <= threshold1 && stattype == ASC.GPU_TEMP) return 'var(--success)';
    else if (+value <= threshold2 && stattype == ASC.GPU_TEMP) return 'var(--warning)';
    else return 'color-mix(in oklch, var(--destructive), black 30%)';
  }

  gettime() {
    return this.uiService.getUISettings()?.agenttimeout ?? 0;
  }
}
