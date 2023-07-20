import { environment } from './../../../environments/environment';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, tap, retryWhen, delay, take, debounceTime } from 'rxjs';
import { AuthService } from './access/auth.service';
import { HttpClient} from '@angular/common/http';
import { setParameter } from './buildparams';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private endpoint = environment.config.prodApiEndpoint;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private as:AuthService,
    ) { }

/**
 * Get logged user id
 * @returns  id
**/

  get userId(){
    return this.as.userId;
  }


/**
 * Returns all
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns  Object
**/
  getAll(methodUrl: string, routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(environment.config.prodApiEndpoint + methodUrl, {params: queryParams})
  }

/**
 * Returns an specific element
 * @param id - element id
 * @returns  Object
**/
  get(methodUrl:string, id: number, routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(`${environment.config.prodApiEndpoint + methodUrl}/${id}`,{params: routerParams})
  }

/**
 * Create
 * @param item - fields
 * @returns  Object
**/
  create(methodUrl:string, item: any): Observable<any> {
    return this.http.post<any>(environment.config.prodApiEndpoint + methodUrl, item)
  }

/**
 * Create Hashlist
 * @param arr - Fields
 * @returns Object
 * TODO FIX
**/
createHashlist(methodUrl:string, arr: any): Observable<any> {
  const str = arr.sourceData;
  const filename = str.replace("C:\\fakepath\\", "");
  return this.http.post<any>(environment.config.prodApiEndpoint + methodUrl, {
          name: arr.name,
          hashTypeId: arr.hashTypeId,
          format: arr.format,
          separator: arr.separator,
          isSalted: arr.isSalted,
          isHexSalt: arr.isHexSalt,
          accessGroupId: arr.accessGroupId,
          useBrain: arr.useBrain,
          brainFeatures: arr.brainFeatures,
          notes: arr.notes,
          sourceType: arr.sourceType,
          sourceData: filename,
          hashCount: arr.hashCount,
          cracked: arr.cracked,
          isArchived: arr.isArchived,
          isSecret: arr.isSecret
        })
}

/**
 * Deletes a element
 * @param id - element id
 * @returns Object
**/
  delete(methodUrl: string, id: number): Observable<any> {
    return this.http.delete(environment.config.prodApiEndpoint + methodUrl +'/'+ id)
    .pipe(
      tap(data => console.log(JSON.stringify(data))),
      retryWhen(errors => {
          return errors
                  .pipe(
                    tap(() => console.log("Retrying...")),
                    delay(2000), // Add a delay before retry delete
                    take(3)  // Retry max 3 times
                  );
      } )
    );
  }

/**
 * Update element information
 * @param id - element id
 * @param arr - fields to be updated
 * @returns Object
**/
  update(methodUrl: string, id: number, arr: any): Observable<any> {
    return this.http.patch<number>(environment.config.prodApiEndpoint + methodUrl + '/' + id, arr)
    .pipe(
      debounceTime(2000)
    );
  }

/**
 * Update agent information
 * @param id - agent id
 * @param arr - fields to be updated
 * @returns Object
**/
  archive(methodUrl: string, id: number): Observable<any> {
    return this.http.patch<number>(environment.config.prodApiEndpoint + methodUrl + '/' + id, {isArchived: true})
  }


}
