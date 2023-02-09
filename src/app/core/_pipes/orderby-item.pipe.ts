import {
  PipeTransform,
  Injectable,
  Pipe,
} from '@angular/core';

/**
 * Order by asc or desc using item
 * @param value - The array to be sorted
 * @param sortOrder - The input text sort option, Ascendent or Descendent
 * @param sortKey - The column name to be sorted
 * Usage:
 *   value | sort
 * Example:
 *     {{ id | sort:'desc':'id'}}
 * @returns 2,1,0
**/

export type SortOrder = 'asc' | 'desc';
@Injectable()
@Pipe({
  name: 'sort',
})

export class ArraySortPipe  implements PipeTransform {
  transform(value: any[], sortOrder: SortOrder | string = 'asc', sortKey?: string): any {
    sortOrder = sortOrder && (sortOrder.toLowerCase() as any);

    if (!value || (sortOrder !== 'asc' && sortOrder !== 'desc')) return value;

    let numberArray = [];
    let stringArray = [];

    if (!sortKey) {
      numberArray = value.filter(item => typeof item === 'number').sort();
      stringArray = value.filter(item => typeof item === 'string').sort();
    } else {
      numberArray = value.filter(item => typeof item[sortKey] === 'number').sort((a, b) => a[sortKey] - b[sortKey]);
      stringArray = value
        .filter(item => typeof item[sortKey] === 'string')
        .sort((a, b) => {
          if (a[sortKey] < b[sortKey]) return -1;
          else if (a[sortKey] > b[sortKey]) return 1;
          else return 0;
        });
    }
     const sorted = [
      ...numberArray,
      ...stringArray,
      ...value.filter(
          item =>
            typeof (sortKey ? item[sortKey] : item) !== 'number' &&
            typeof (sortKey ? item[sortKey] : item) !== 'string',
      ),
     ];
    return sortOrder === 'asc' ? sorted : sorted.reverse();
  }
}
