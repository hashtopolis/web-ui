import {
  Pipe,
  PipeTransform } from "@angular/core";
import { __values } from "tslib";

/*
 * Pipe used for searching
 * Usage:
 *   value | SearchPipe
 * Example:
 *     {{ item | SearchPipe}}
 *   return is: item
*/

@Pipe({
  name: "search"
})

export class SearchPipe implements PipeTransform {
    transform(value: any, q?: any,colName: any="isArchived"): any {
        if(!value) return null;
        if(!q) return value;
        q = q.toLowerCase();
        return value.filter((item)=> {
            return item[colName].toString().toLowerCase().includes(q);
        });
    }
}
