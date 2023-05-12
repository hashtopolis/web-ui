import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private endpoint = environment.config.prodApiEndpoint + '/configreport';

  constructor(private http: HttpClient) { }

  getConfReport():Observable<any> {
    return this.http.get(this.endpoint)
  }

}
