import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import {AppConfiguration} from '../set_configuration/app-configuration';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

    config: any[] = null;
    LOG: string = "log";
    check: boolean = false;

    constructor(private http: HttpClient,
                private appConfig: AppConfiguration) { }

  ngOnInit() {
    this.getConfig()
  }

  getConfig(){
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
    })
    const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/config/"
    this.http.get(url, { headers: headers }).subscribe( data =>
    {
      if(data!=null){
        var list = []
        Object.keys(data).forEach(function(elem){
          var object={"key":null,"value":null}
          object.key=elem
          object.value=data[elem]
          list.push(object)
        })
        console.log(list)
        this.config = list

      }
      else {
       console.log('no response')
      }
    })
  }

  change(event){
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': jwt
    })
    // headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    this.check=false
    event.preventDefault()
    //console.log(this.config);
    var configObject = {}
    this.config.forEach(element => {
      configObject[element.key] = element.value
    })
    const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/config/update"

    this.http.post(url, configObject, {headers: headers}).subscribe( data =>
    {
      if(data!=null){
        this.check=true
      }
      else {
       console.log('no response')
      }
    })
  }
}
