import { Pipe, PipeTransform } from '@angular/core';

import { BaseModel } from '@models/base.model';

/**
 * Pipe used for searching
 * @param value - The input text
 * Usage:
 *   value | SearchPipe
 * Example:
 *     {{ item | SearchPipe}}
 * @returns item
 **/

@Pipe({
  name: 'search',
  standalone: false
})
export class SearchPipe implements PipeTransform {
  transform(value: BaseModel[] | null, q?: string, colName: string = 'isArchived'): BaseModel[] | null {
    if (!value) return null;
    if (!q) return value;
    q = q.toLowerCase();
    return value.filter((item) => {
      return String(item[colName]).toLowerCase().includes(q);
    });
  }
}
