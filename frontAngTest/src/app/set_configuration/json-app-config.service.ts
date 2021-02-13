import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfiguration} from './app-configuration';

@Injectable({
  providedIn: 'root'
})
export class JsonAppConfigService extends AppConfiguration {

  constructor(private http: HttpClient) {
    super();
  }

  load() {
    return this.http.get<AppConfiguration>('app.config.json')
      .toPromise()
      .then(data => {
        this.back_url = data.back_url;
        this.socket_url = data.socket_url
        this.protocol = data.protocol;
      })
      .catch(() => {
        console.error('Could not load configuration');
      });
  }

}
