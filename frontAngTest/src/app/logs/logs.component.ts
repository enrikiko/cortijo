import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import {AppConfiguration} from '../set_configuration/app-configuration';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  logs: any[]=null;

  constructor(private http: HttpClient,
              private appConfig: AppConfiguration) { }

  ngOnInit() {
    this.getLogs()
  }

  getLogs(){
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
    })
    const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/all/log"
    this.http.get<any[]>(url, { headers: headers }).subscribe( data =>
    {
      if(data!=null){
        console.log(data)
        this.logs=data;
      }
      else {
      console.log('No logs')
      }
    })
  }
}
