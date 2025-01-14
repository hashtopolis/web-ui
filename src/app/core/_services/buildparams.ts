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
      queryParams = queryParams.set(key, routerParams[key]);
    }
  }

  // If maxResults is not present, add it to queryParams only if it's defined
  if (maxResults != undefined && !queryParams.has('maxResults')) {
    queryParams = queryParams.set('maxResults', maxResults);
  }

  return queryParams;
}
