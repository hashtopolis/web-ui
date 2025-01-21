/**
 * Returns params in right format to query in the service
 *
 * @param routerParams - Array of multiple params
 * @returns nested params
 * ```
 * @public
 */

import { HttpParams } from '@angular/common/http';
import { Params } from '@angular/router';

export function setParameter(
  routerParams: Params,
  maxResults?: string | number
): HttpParams {
  let queryParams = new HttpParams();
  for (const key in routerParams) {
    if (routerParams.hasOwnProperty(key)) {

      //The filter must be split manually as the filter parameter is dynamic
      if (key != "filter") {
        queryParams = queryParams.set(key, routerParams[key]);
      }
      else {
        let filterSplitted: string[] = routerParams[key].split("=");
        queryParams = queryParams.set(filterSplitted[0], filterSplitted[1]);
      }
    }
  }

  // If maxResults is not present, add it to queryParams only if it's defined
  if (maxResults != undefined && !queryParams.has('maxResults')) {
    queryParams = queryParams.set('maxResults', maxResults);
  }

  return queryParams;
}
