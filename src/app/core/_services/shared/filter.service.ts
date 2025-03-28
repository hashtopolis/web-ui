import { Injectable } from '@angular/core';
import { PropertyResolver } from '@src/app/core/_services/property-resolver';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  /**
   * Filters items based on whether its included props match the filterValue
   * @param items Items to filter
   * @param filterValue Value to match
   * @param props Properties to include
   */
  filter<T>(items: T[], filterValue: string, props: string[]) {
    return items.filter((item: T) => {
      let match = false;
      for (const prop of props) {
        if (prop.indexOf('.') > -1) {
          const value = PropertyResolver.resolve(prop, item);
          if (value && value.toUpperCase().indexOf(filterValue) > -1) {
            match = true;
            break;
          }
          continue;
        }

        if ((item as any)[prop].toString().toUpperCase().indexOf(filterValue) > -1) {
          match = true;
          break;
        }
      }
      return match;
    });
  }
}
