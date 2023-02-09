import {
  PipeTransform,
  Pipe,
} from '@angular/core';
import { ASC } from '../_constants/agentsc.config';
import { UIConfigService } from '../_services/shared/storage.service';

/**
 * Returns different hex color depending on thresholds and Agent type (Device Temperature, Device Utilizations, CPU utilization)
 * @param value - The input number value
 * Usage:
 *   value | asColor
 * Example:
 *   {{ 65 | asColor }}
 * @returns #b16a06
**/

@Pipe({
  name: 'asColor'
})
export class AgentSColorPipe implements PipeTransform {

  constructor(private uiService: UIConfigService) { }

  transform(value: any, threshold1: number, threshold2: number, stattype: number, isActive: any, lastactivity: number) {
    if (value === 'No data') {
      if ((isActive == 1) && (Date.now() - lastactivity < this.gettime())) {
        return "#42d4f4";
      }
      return "#CCCCCC";
    }
    if(+value == 0)
      return '#FF0000';
    if (+value > threshold1 && (stattype == ASC.GPU_TEMP || stattype == ASC.CPU_UTIL))
      return '#009933';
    else if (+value > threshold2 && (stattype == ASC.GPU_TEMP || stattype == ASC.CPU_UTIL))
      return '#ff9900';
    if (+value <= threshold1 && stattype == ASC.GPU_UTIL)
      return '#009933';
    else if (+value <= threshold2 && stattype == ASC.GPU_UTIL )
      return '#ff9900';
    else
      return '#800000';
  }

  gettime(){
    return this.uiService.getUIsettings('agenttimeout').value;
  }

}
