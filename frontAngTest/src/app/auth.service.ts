import { Injectable, Component, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import {AppConfiguration} from './set_configuration/app-configuration';


interface myData {
  success: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private status = false;
  private certain = false;

  @Output()
  jwtEvent: EventEmitter<string> = new EventEmitter();
  statusEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(private router: Router,
              private http: HttpClient,
              private appConfig: AppConfiguration) { };

  jwtEventEmitter(){ return this.jwtEvent }
  statusEventEmitter(){ return this.statusEvent }
  propagateJWT(jwt){ this.jwtEvent.emit(jwt) }
  propagateStatus(status){ this.statusEvent.emit(status) }

  authJWT(){
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
      })
    const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/jwt"
    this.http.get<any>(url, { headers: headers }).subscribe( data => {
      if(data!=null){
        if(data.status){
          this.router.navigate(["devices"])
          this.status = true
          this.propagateStatus(this.status)
        }
      }
    })
  }

  isLogin(){
    if(!this.certain){
      this.authJWT()
      this.certain=true
    }
    return this.status
  }

  login( tenant, user, password ) {
      const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/auth"
      let object={}
      object["tenant"] = tenant;
      object["user"] = user;
      object["password"] = password;
      this.http.put<any>(url, object).subscribe( data =>
      {
        console.log(data);

        if(data.status==true){
          window.localStorage.setItem('jwt', data.jwt)
          this.propagateJWT(data.jwt)
          this.status = true
          this.propagateStatus(this.status)
        }
        else {
          console.log("false");
          console.log(false);
          this.status = false
          this.propagateStatus(this.status)
        }
      })
  }

  logOut(){
    this.status = false
    window.localStorage.setItem('jwt', null)
  }

}
