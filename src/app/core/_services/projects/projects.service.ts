import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap} from 'rxjs/operators';
import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private endpoint = environment.config.devApiEndpoint + '/projects';
  private endpoint_project = environment.config.devApiEndpoint + '/projects';  // its for testing using nested json array

  constructor(private http: HttpClient) { }

  projects():Observable<any> {
    return this.http.get(this.endpoint)
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }

  getProject(id: number):Observable<any> {
    // return this.http.get(`${this.endpoint_user}/${id}`)  // We need this for the API
    return this.http.get(this.endpoint_project)
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }


}
