import { Pipe, PipeTransform } from '@angular/core';

import { BaseModel } from '@models/base.model';

/**
 * Pipe to filter by Id
 * @param key - The input column name
 * @param value -The input id value
 * Usage:
 *   value | fileSize:Units
 * Example:
 *   {{ Object | filterItem:'agentId':a.agentId }}
 * @returns Filter by Id
 **/
@Pipe({
  name: 'filterItem',
  standalone: false
})
export class FilterItemPipe implements PipeTransform {
  transform(list: BaseModel[], key: string, value: number): BaseModel[] {
    // use the id
    if (value === undefined || value === null) {
      value = 0;
    }
    return list.filter((i) => i[key] === +value);
  }
}
