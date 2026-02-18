/**
 * Returns params in right format to query in the service
 *
 * @param routerParams - Array of multiple params
 * @returns nested params
 * ```
 * @public
 */

import { HttpParams } from '@angular/common/http';

import { Filter, type RequestParams } from '@models/request-params.model';

export function setParameter(params: RequestParams): HttpParams {
  let httpParams = new HttpParams();

  // Handle pagination parameters
  const page = params.page;
  if (page) {
    Object.entries(page).forEach(([key, value]) => {
      if (value !== undefined) {
        httpParams = httpParams.set(`page[${key}]`, value.toString());
      }
    });
  }

  // Handle include array
  const include = params.include;
  if (Array.isArray(include) && include.length > 0) {
    httpParams = httpParams.set('include', include.join(','));
  }

  // Handle filter parameters
  const filters: Array<Filter> = params.filter;
  if (Array.isArray(filters)) {
    filters.forEach((filter) => {
      const parent = filter.parent ? `${filter.parent}.` : '';
      httpParams = httpParams.set(`filter[${parent}${filter.field}__${filter.operator}]`, filter.value.toString());
    });
  }

  // Handle ordering parameter
  const sort = params.sort;
  if (Array.isArray(sort) && sort.length > 0) {
    httpParams = httpParams.set('sort', sort.join(','));
  }

  if (params.include_total) {
    httpParams = httpParams.set('include_total', params.include_total);
  }

  return httpParams;
}
