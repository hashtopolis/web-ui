import { Injectable, Pipe, PipeTransform } from '@angular/core';

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
  name: 'staticArray'
})
@Injectable({
  providedIn: 'root'
})
export class StaticArrayPipe implements PipeTransform {

  transform(id: any, search: any) {
    const platforms = [
      "unknown",
      "NVidia",
      "AMD",
      "CPU"
    ];
    const oses = [
      '<span class="fab fa-linux" aria-hidden="true"></span>',
      '<span class="fab fa-windows" aria-hidden="true"></span>',
      '<span class="fab fa-apple" aria-hidden="true"></span>'
    ];
    const formats = [
      "Text",
      "HCCAPX / PMKID",
      "Binary",
      "Superhashlist"
    ];
    const formattables = [
      "hashes",
      "hashes_binary",
      "hashes_binary"
    ];
    const states = [
      "New",
      "Init",
      "Running",
      "Paused",
      "Exhausted",
      "Cracked",
      "Aborted",
      "Quit",
      "Bypass",
      "Trimmed",
      "Aborting..."
    ];
    switch (search) {
      case 'os':
        if (id == '-1') {
          return platforms[0];
        }
        return oses[id];
      case 'states':
        return states[id];
      case 'formats':
        return formats[id];
      case 'formattables':
        return formattables[id];
      case 'platforms':
        if (id == '-1') {
          return platforms[0];
        }
        return platforms[id];
    }
    return "";
  }

}
