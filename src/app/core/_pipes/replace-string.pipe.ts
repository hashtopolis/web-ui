import { Pipe, PipeTransform } from '@angular/core';
/*
 * Replace a string
 * Usage:
 *   value | replaceString:strToReplace:replacementStr
 * Example:
 *   {{ Hashtopussy | fileSize:topussy:topolis }}
 *   formats to: Hashtopolis
*/
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
