import {
  PipeTransform,
  Pipe
} from '@angular/core';

/**
 * This function groups and object by column name
 * @param arr - Object array
 * @param name -Column name
 * Usage:
 *   object | groupBy:'name'
 * Example:
 *   {{ object | groupBy:'name' }}
 * @returns Object
**/

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {

  transform(arr: Array<any>, name: string) {
      if (!arr.length || !name) {
        return null;
      }
    // Temporary until we get location field in API
    // Replace with the code below
    // const list = arr.reduce(function (r,a){
    //       r[a[name]] = r[a[name]] || [];
    //       r[a[name]].push(a);
    // return r;
    // },{});
     const list = arr.reduce(function (r,a){
           r[a[name].split('-')[0]] = r[a[name].split('-')[0]] || [];
           r[a[name].split('-')[0]].push(a);
     return r;
     },{});

     return Object.keys(list).map(k => ({ k, value: list[k] }));

    }
}


