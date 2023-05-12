import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { setParameter } from '../buildparams';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/tasks';

  constructor(private http: HttpClient) { }

/**
 * Returns all the tasks
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns  Object
**/
  getAlltasks(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint, {params: queryParams})
  }

/**
 * Returns an specific task
 * @param id - taskId
 * @returns  Object
**/
  getTask(id:number):Observable<any> {
    return this.http.get(this.endpoint +'/'+ id)
  }

/**
 * Deletes a task
 * @param id - task id
 * @returns Object
**/
  deleteTask(id:number):Observable<any> {
    return this.http.delete(this.endpoint +'/'+ id);
  }

/**
 * create task information
 * @param arr - fields
 * @returns Object
**/
  createTask(arr: any): Observable<any> {
    return this.http.post<any>(this.endpoint, arr)
  }

/**
 * Update task information
 * @param id - agent id
 * @param arr - fields to be updated
 * @returns Object
**/
  updateTask(id: number, arr: any): Observable<any> {
    return this.http.patch<number>(this.endpoint + '/' + id, arr)
  }

/**
 * Update agent information
 * @param id - agent id
 * @param arr - fields to be updated
 * @returns Object
**/
  archiveTask(id: number): Observable<any> {
    return this.http.patch<number>(this.endpoint + '/' + id, {isArchived: true})
  }


}
