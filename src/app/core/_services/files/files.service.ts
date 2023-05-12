import { environment } from './../../../../environments/environment';
import { Observable, tap, retryWhen, delay, take } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { setParameter } from '../buildparams';
import { Injectable } from "@angular/core";
import { Params } from '@angular/router';

import { Filetype, UpdateFileType } from '../../_models/files';

@Injectable({providedIn: 'root'})
export class FilesService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/files';

  constructor(private http: HttpClient) { }

/**
 * Get all Files
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns Object
**/
  getFiles(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
      if (routerParams) {
          queryParams = setParameter(routerParams);
      }
    return this.http.get(this.endpoint, {params: queryParams})
  }

/**
 * Get individial File by id
 * @param id - File id
 * @returns Object
**/
  getFile(id: number):Observable<any> {
    return this.http.get(`${this.endpoint}/${id}`)
  }

/**
 * Delete individialFile by id
 * @param id -File id
 * @returns Object
**/
  deleteFile(id: number):Observable<any> {
    return this.http.delete(this.endpoint +'/'+ id)
    .pipe(
      retryWhen(errors => {
        return errors
                .pipe(
                  tap(() => console.log("Retrying...")),
                  delay(2000), // Add a delay before retry delete
                  take(3)  // Retry delete Agents
                );
    } )
    );
  }

/**
 * Create File
 * @param arr - fields
 * @returns Object
**/
  createFile(arr: any): Observable<any> {
    return this.http.post<any>(this.endpoint, arr)
  }

/**
 * Update File
 * @param arr - Fields
 * @returns Object
**/
  updateFile(arr: any): Observable<UpdateFileType> {
    return this.http.patch<any>(this.endpoint + '/' + arr.fileId, arr.updateData)
  }

/**
 * Update Files in Bulk
 * @param id - File id
 * @param arr - Fields
 * @returns Object
 * TODO - Combine with the one above
**/
  updateBulkFile(id: number, arr: any): Observable<UpdateFileType> {
    return this.http.patch<any>(this.endpoint + '/' + id, arr)
  }

}
