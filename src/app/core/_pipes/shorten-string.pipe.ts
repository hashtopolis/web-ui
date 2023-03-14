import {
  PipeTransform,
  Pipe
} from '@angular/core';

/**
 * Shortest any text usinng a limit parameter, if its greater than the max returns the limit plus 3 consecutive dots
 * @param value - The input text
 * @param limit - The output string limit
 * Usage:
 *   value | shortenString:limit
 * Example:
 *   {{ Benito | shortenString:3 }}
 * @returns Ben
**/

@Pipe({
  name: 'shortenString'
})
export class ShortenStringPipe implements PipeTransform {

  transform(value: any, limit: number) {
    if(value.length > limit){
      return value.substr(0, limit) +'...';
    }
    return value;
  }

}
