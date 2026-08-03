import { Pipe, PipeTransform } from '@angular/core';

const UNITS = ['H/s', 'kH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s'];

/**
 * Pick a human-readable hash rate unit and return the pieces needed to render it.
 * @param value - The raw hash rate (e.g. 1000000)
 * @param decimals - Number of decimal places (default: 2)
 * @returns value scaled into the chosen unit, the unit label, and the scale
 *          (raw H/s per displayed unit, i.e. rawValue = value * scale)
 */
export function getHashRateFormatComponents(
  value: number,
  decimals = 2
): { value: number; unit: string; scale: number } {
  if (!value || value <= 0) {
    return { value: 0, unit: 'H/s', scale: 1 };
  }

  let i = 0;
  while (value >= 1000 && i < UNITS.length - 1) {
    value /= 1000;
    i++;
  }

  return { value: +value.toFixed(decimals), unit: UNITS[i], scale: 1000 ** i };
}

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
  transform(value: number, decimals = 2): string {
    const { value: scaled, unit } = getHashRateFormatComponents(value, decimals);
    return `${scaled} ${unit}`;
  }
}
