import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transform hash rate into human-readable format (e.g. H/s, kH/s, MH/s, GH/s)
 * @param hashrate - The hash rate number (e.g. 1000000)
 * @param decimals - Optional number of decimal places (default: 2)
 * Usage:
 *   value | hashRate
 * Example:
 *   {{ 1000000 | hashRate }}
 * @returns 1 MH/s
 */
@Pipe({
  name: 'hashRate',
  standalone: false
})
export class HashRatePipe implements PipeTransform {
  private readonly units = ['H/s', 'kH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s'];

  transform(value: number, decimals: number = 2, asObject: boolean = false): string | { value: number; unit: string } {
    if (!value || value <= 0) {
      return asObject ? { value: 0, unit: 'H/s' } : '0 H/s';
    }

    let i = 0;
    while (value >= 1000 && i < this.units.length - 1) {
      value /= 1000;
      i++;
    }

    const rounded = +value.toFixed(decimals);

    return asObject ? { value: rounded, unit: this.units[i] } : `${rounded} ${this.units[i]}`;
  }
}
