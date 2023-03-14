import {
  PipeTransform,
  Pipe,
} from '@angular/core';

/**
 * Returns label information in hex colors
 * @param value - The input text value
 * Usage:
 *   value | warningColor
 * Example:
 *   {{ warning | warningColor }}
 * @returns #b16a06
**/

@Pipe({
  name: 'warningColor'
})
export class WarningColorPipe implements PipeTransform {

  transform(value: any) {
    if(value == 'information')
      return '#DAF7A6 ';
    else if (value == 'warning')
      return '#FFC300 ';
    else if (value == 'error')
      return '#8b0010';
    else if (value == 'fatal error')
      return '#750404';
    else
      return 'white';
  }
}
