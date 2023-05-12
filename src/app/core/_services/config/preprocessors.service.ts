import { environment } from './../../../../environments/environment';
import { Preprocessor } from '../../_models/preprocessor';
import { HttpClient } from '@angular/common/http';
import { setParameter } from '../buildparams';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreprocessorService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/preprocessors';

  constructor(private http: HttpClient) { }

/**
 * Get all Preprocessors
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns Object
**/
  getPreprocessors(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint, {params: queryParams})
  }

/**
 * Get individial preprocessor by id
 * @param id - Preprocessor id
 * @returns Object
**/
  getPreprocessor(id: number):Observable<any> {
    return this.http.get(`${this.endpoint}/${id}`)
  }

/**
 * Delete individial preprocessor by id
 * @param id - Preprocessor id
 * @returns Object
**/
  deletePreprocessor(id: number):Observable<any> {
    return this.http.delete(this.endpoint +'/'+ id);
  }

/**
 * Create Preprocessor
 * @param arr - Fields
 * @returns Object
**/
  createPreprocessor(arr: any): Observable<Preprocessor[]> {
    return this.http.post<any>(this.endpoint, arr)
  }

/**
 * Update Preprocessor
 * @param id - preprocessor id
 * @param arr - Fields
 * @returns Object
**/
  updateHashType(id: number, arr: any): Observable<any> {
    return this.http.patch<number>(this.endpoint + '/' + id, arr)
  }

}
