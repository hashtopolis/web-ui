import {
  PipeTransform,
  Pipe
} from '@angular/core';

/**
 * Replace a string
 * @param value - The array
 * @param strToReplace - The input text to be replaced
 * @param replacementStr - The input text replacement
 * Usage:
 *   value | replaceString:strToReplace:replacementStr
 * Example:
 *   {{ Hashtopussy | fileSize:topussy:topolis }}
 * @returns Hashtopolis
**/

@Pipe({
  name: 'replaceString'
})
export class ReplaceStringPipe implements PipeTransform {

  transform(value: string, strToReplace: string, replacementStr: string): string {

    if (!value || !strToReplace || !replacementStr) {
      return value;
    }

    return value.replace(new RegExp(this.escapeStr(strToReplace), 'g'), replacementStr);
  }

  escapeStr(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

}
