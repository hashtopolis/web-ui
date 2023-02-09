import {
  PipeTransform,
  Pipe
} from '@angular/core';

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
  name: 'filterItem'
})
export class FilterItemPipe implements PipeTransform {

  transform(list: any, key:string, value:number) {
    // use the id
    if(value === undefined  || value === null) return value;

    return list.filter(i => i[key] === +value);
}

}
