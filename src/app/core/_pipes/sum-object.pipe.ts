import {
  PipeTransform,
  Pipe
} from '@angular/core';

/**
 * This function use the object key and returns the sum
 * @param value - Object
 * @param name -Column name
 * Usage:
 *   object | sum:'name'
 * Example:
 *   {{ object | sum:'value' }}
 * @returns number
**/

@Pipe({
  name: 'sum'
})
export class SumPipe implements PipeTransform {

  transform(value: any[], name: string) {
      if (value.length === 0 || !name) {
        return 'No data';
      }

      const arr = [];
      for(let i=0; i < value.length; i++){
        arr.push(Number(value[i][name]));
      }
      const sum = arr.reduce((a, i) => a + i, 0);

      return sum;

    }
}
