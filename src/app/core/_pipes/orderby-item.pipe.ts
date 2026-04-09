import { Injectable, Pipe, PipeTransform } from '@angular/core';

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
  standalone: false
})
export class ArraySortPipe implements PipeTransform {
  transform(value: unknown[], sortOrder: SortOrder = 'asc', sortKey?: string): unknown[] {
    sortOrder = sortOrder?.toLowerCase() as SortOrder;

    if (!value || (sortOrder !== 'asc' && sortOrder !== 'desc')) return value;

    let numberArray: unknown[] = [];
    let stringArray: unknown[] = [];

    if (!sortKey) {
      numberArray = value.filter((item) => typeof item === 'number').sort();
      stringArray = value.filter((item) => typeof item === 'string').sort();
    } else {
      const keyed = value as Record<string, unknown>[];
      numberArray = keyed
        .filter((item) => typeof item[sortKey] === 'number')
        .sort((a, b) => (a[sortKey] as number) - (b[sortKey] as number));
      stringArray = keyed
        .filter((item) => typeof item[sortKey] === 'string')
        .sort((a, b) => {
          if ((a[sortKey] as string) < (b[sortKey] as string)) return -1;
          else if ((a[sortKey] as string) > (b[sortKey] as string)) return 1;
          else return 0;
        });
    }
    const sorted = [
      ...numberArray,
      ...stringArray,
      ...value.filter((item) => {
        const val = sortKey ? (item as Record<string, unknown>)[sortKey] : item;
        return typeof val !== 'number' && typeof val !== 'string';
      })
    ];
    return sortOrder === 'asc' ? sorted : sorted.reverse();
  }
}
