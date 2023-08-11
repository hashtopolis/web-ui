import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configUrl = 'assets/config.json';

  constructor(private http: HttpClient) { }

  private getConfigOnce(): Observable<any> {
    return this.http.get(this.configUrl);
  }

  public getEndpoint(){
    let ApiEndPoint = localStorage.getItem('prodApiEndpoint');
    if (!ApiEndPoint) {
      this.getConfigOnce().subscribe(config => {
        // Assuming the JSON contains a property named 'backendUrl'
        if (config && config.hashtopolis_backend_url) {
          // If we get a config from the backend, we set the config property
          ApiEndPoint = config.hashtopolis_backend_url;
          localStorage.setItem('prodApiEndpoint', ApiEndPoint);
        } else if (config && !config.hashtopolis_backend_url) {
          console.error('Invalid configuration file. Please check your config.json. Using defaults.');
          ApiEndPoint = environment.config.prodApiEndpoint;
          localStorage.setItem('prodApiEndpoint', ApiEndPoint);
        } else {
          ApiEndPoint = environment.config.prodApiEndpoint;
          localStorage.setItem('prodApiEndpoint', ApiEndPoint);
        }
      });
    }
    return ApiEndPoint;
  }
}
