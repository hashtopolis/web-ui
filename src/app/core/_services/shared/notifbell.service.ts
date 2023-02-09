import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NotificationsBellService {

  private endpoint = environment.config.devApiEndpoint + '/notifbell';

  constructor(private http: HttpClient) { }

  getNoficationsBell():Observable<any> {
    return this.http.get(this.endpoint);
  }

}
