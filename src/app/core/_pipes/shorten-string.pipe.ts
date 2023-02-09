import { Pipe, PipeTransform } from '@angular/core';
/*
 * Shortest any text usinng a limit parameter, if its greater than the max returns the limit plus 3 consecutive dots
 * Usage:
 *   value | shortenString:limit
 * Example:
 *   {{ Beni | shortenString:1 }}
 *   formats to: Ben
*/
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
