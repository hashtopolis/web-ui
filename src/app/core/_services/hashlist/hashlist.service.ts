import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { setParameter } from '../buildparams';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { BaseHashlist} from '../../_models/hashlist';

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/hashlists';

  constructor(private http: HttpClient) { }

/**
 * Get all Hashlists
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns Object
**/
  getAllhashlists(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint, {params: queryParams})
  }

/**
 * Get individial hashlist by id
 * @param id - Hashlist id
 * @returns Object
**/
  getHashlist(id: number):Observable<any> {
    return this.http.get(`${this.endpoint}/${id}`)
  }

/**
 * Delete individial by id
 * @param id - id
 * @returns Object
**/
  deleteHashlist(id: number):Observable<any> {
    return this.http.delete(this.endpoint +'/'+ id);
  }

/**
 * Create Preprocessor
 * @param arr - Fields
 * @returns Object
 * TODO FIX
**/
  createHashlist(hash: any): Observable<BaseHashlist> {
    const str = hash.sourceData;
    const filename = str.replace("C:\\fakepath\\", "");
    return this.http.post<any>(this.endpoint, {
            name: hash.name,
            hashTypeId: hash.hashTypeId,
            format: hash.format,
            separator: hash.separator,
            isSalted: hash.isSalted,
            isHexSalt: hash.isHexSalt,
            accessGroupId: hash.accessGroupId,
            useBrain: hash.useBrain,
            brainFeatures: hash.brainFeatures,
            notes: hash.notes,
            sourceType: hash.sourceType,
            sourceData: filename,
            hashCount: hash.hashCount,
            cracked: hash.cracked,
            isArchived: hash.isArchived,
            isSecret: hash.isSecret
          })
  }

/**
 * Update Hashlist
 * @param id - preprocessor id
 * @param arr - Fields
 * @returns Object
**/
  updateHashlist(id: number, arr: any): Observable<any> {
    return this.http.patch<number>(this.endpoint + '/' + id, arr)
  }

/**
 * Archive Hashlist
 * @param id - preprocessor id
 * @returns Object
**/
  archiveHashlist(id: number): Observable<any> {
    return this.http.patch<number>(this.endpoint + '/' + id, {isArchived: true})
  }

}
