import {
  PipeTransform,
  Pipe
} from '@angular/core';

/**
 * Transform bytes to a readable unit adding abbreviation units or long form
 * @param sizeB - The input number
 * @param longForm -The output unit abbreviation or long text
 * Usage:
 *   value | fileSize:Units
 * Example:
 *   {{ 1024 | fileSize:FILE_SIZE_UNITS }}
 * @returns 1KB
**/

const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const FILE_SIZE_UNITS_LONG = ['Bytes', 'Kilobytes', 'Megabytes', 'Gigabytes', 'Pettabytes', 'Exabytes', 'Zettabytes', 'Yottabytes'];

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  transform(sizeB: number, longForm: boolean): string {
    const BASE_SIZE = 1024;
    const units = longForm
      ? FILE_SIZE_UNITS_LONG
      : FILE_SIZE_UNITS;
    let result: number | string = 0;

    if (sizeB < 1 ) { return result = '0 B'; }

    let power = Math.round(Math.log(sizeB) / Math.log(BASE_SIZE));
    power = Math.min(power, units.length - 1);

    const size = sizeB / Math.pow(BASE_SIZE, power); // size in new units
    const formattedSize = Math.round(size * 100) / 100; // keep up to 2 decimals
    const unit = units[power];

    return `${formattedSize} ${unit}`;
  }

}
