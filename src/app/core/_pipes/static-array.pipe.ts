import { Injectable, Pipe, PipeTransform } from '@angular/core';

/** Which static lookup table {@link StaticArrayPipe} reads from. */
export const StaticArrayKind = {
  OS: 'os',
  STATES: 'states',
  STATES_COLOR: 'statescolor',
  FORMATS: 'formats',
  FORMAT_TABLES: 'formattables',
  PLATFORMS: 'platforms'
} as const;
export type StaticArrayKind = (typeof StaticArrayKind)[keyof typeof StaticArrayKind];

/**
 * Static Array, with some static configurations
 * @param id - The input number, id
 * @param search - The input option to search for
 * Usage:
 *   value | staticArray:search
 * Example:
 *   {{ 0 | staticArray:formats }}
 * @returns The string text value
 *
 * @beta FIXME: This should be part of the config table in the database
 **/

@Pipe({
  name: 'staticArray',
  standalone: false
})
@Injectable({
  providedIn: 'root'
})
export class StaticArrayPipe implements PipeTransform {
  transform(id: number | undefined, search: StaticArrayKind): string {
    if (id === undefined) return '';
    const platforms = ['unknown', 'NVidia', 'AMD', 'CPU'];
    const oses = [
      '<span class="fab fa-linux" aria-hidden="true"></span>',
      '<span class="fab fa-windows" aria-hidden="true"></span>',
      '<span class="fab fa-apple" aria-hidden="true"></span>'
    ];
    const formats = ['Text', 'HCCAPX / PMKID', 'Binary', 'Superhashlist'];
    const formattables = ['hashes', 'hashes_binary', 'hashes_binary'];
    const states = [
      'New',
      'Init',
      'Running',
      'Paused',
      'Exhausted',
      'Cracked',
      'Aborted',
      'Quit',
      'Bypass',
      'Trimmed',
      'Aborting...'
    ];
    const statescolor = ['orange', 'black', 'green', 'black', 'black', 'blue', 'red', 'red', 'red', 'red', 'red'];
    switch (search) {
      case StaticArrayKind.OS:
        if (id === -1) {
          return platforms[0];
        }
        return oses[id];
      case StaticArrayKind.STATES:
        return states[id];
      case StaticArrayKind.STATES_COLOR:
        return statescolor[id];
      case StaticArrayKind.FORMATS:
        return formats[id];
      case StaticArrayKind.FORMAT_TABLES:
        return formattables[id];
      case StaticArrayKind.PLATFORMS:
        if (id === -1) {
          return platforms[0];
        }
        return platforms[id];
    }
    return '';
  }
}
