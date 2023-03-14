import {
  PipeTransform,
  Pipe
} from '@angular/core';

/**
 * This function takes the object access the key values annd returns the max value
 * @param value - Object
 * @param name -Column name
 * Usage:
 *   object | max:'name'
 * Example:
 *   {{ object | max:'value' }}
 * @returns number
**/

@Pipe({
  name: 'max'
})
export class MaximizePipe implements PipeTransform {

  transform(value: any[], name: string) {
      if (value.length === 0 || !name) {
        return 'No data';
      }

      value.sort((a, b) => b[name] - a[name]);

      // Get maximum from array
      // var arr = [];
      // for(let i=0; i < value.length; i++){
      //   arr.push(value[i][name]);
      // }
      // var max = Math.max(...arr)

      return Math.round(value[0][name]).toFixed(1);

    }
}
