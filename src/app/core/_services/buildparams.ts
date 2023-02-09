/**
 * Returns params in right format to query in the service
 *
 * @param routerParams - Array of multiple params
 * @returns nested params
 * ```
 * @public
 */

import { HttpParams } from "@angular/common/http";
import { Params } from "@angular/router";

export function setParameter(routerParams: Params): HttpParams {
  let queryParams = new HttpParams();
  for (const key in routerParams) {
      if (routerParams.hasOwnProperty(key)) {
          queryParams = queryParams.set(key, routerParams[key]);
      }
  }
  return queryParams;
}


