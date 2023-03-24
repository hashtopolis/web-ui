import {
  PipeTransform,
  Pipe
} from '@angular/core';

/**
 * This function split a string using a character
 * @param item - String
 * @param char - Char to replace
 * @param num - Part to take, 0 first part, 1 second part
 * Usage:
 *   string | split:'name'
 * Example:
 *   {{ Rack007-Ebidem | split:'-':1 }}
 * @returns Ebidem
**/

@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {

  transform(item: string, char: string, num: number) {

    if (item.includes(char)) { return item.split(char)[num]; }

    return item;

    }
}


