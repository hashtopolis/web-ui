import { Pipe, PipeTransform } from '@angular/core';

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
  transform(value: Record<string, unknown>[] | null, q?: string, colName: string = 'isArchived'): Record<string, unknown>[] | null {
    if (!value) return null;
    if (!q) return value;
    q = q.toLowerCase();
    return value.filter((item) => {
      return String(item[colName]).toLowerCase().includes(q);
    });
  }
}
