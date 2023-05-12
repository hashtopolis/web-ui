import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { setParameter } from '../buildparams';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/vouchers';

  constructor(private http: HttpClient) { }

/**
 * Returns all agent vouchers
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns Object
**/
  getVouchers(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint, {params: queryParams})
  }

/**
 * Delete a voucher
 * @param id - Voucher id
 * @returns Object
**/
  deleteVoucher(id: number):Observable<any> {
    return this.http.delete(this.endpoint + '/' + id);
  }

/**
 * Creates a new voucher
 * @param arr - Voucher structure
 * @returns Object
**/
  createVoucher(arr: string):Observable<any> {
    return this.http.post(this.endpoint, arr);
  }


}
