import {
  PipeTransform,
  Pipe
} from '@angular/core';

/**
 * This function takes the object access the key values annd returns the average value
 * @param value - Object
 * @param name -Column name
 * Usage:
 *   object | avg:'name'
 * Example:
 *   {{ object | avg:'value' }}
 * @returns number
**/

@Pipe({
  name: 'avg'
})
export class AveragePipe implements PipeTransform {

  transform(value: any[], name: string) {
      if (value.length === 0 || !name) {
        return 'No data';
      }

      var arr = [];
      for(let i=0; i < value.length; i++){
        arr.push(Number(value[i][name]));
      }
      var sum = arr.reduce((a, i) => a + i, 0);
      var avg = (Math.round(sum / value.length).toFixed(1)) || 0;

      return avg;

    }
}
