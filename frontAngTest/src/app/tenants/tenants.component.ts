import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import {AppConfiguration} from '../set_configuration/app-configuration';

@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.css']
})
export class TenantsComponent implements OnInit {

  secret: String;
  tenant: String;
  userName: String;
  password: String;
  status: String;
  createdTenant: String;
  error: Boolean;
  url = null;


  constructor(private router: Router,
              private http: HttpClient,
              private appConfig: AppConfiguration) { }

  ngOnInit() {
    this.getUrl()
  }

  logIn(){
    this.router.navigate(['login'])
  }

  singIn(){
    this.router.navigate(['users'])
  }

  createTenant(event) {
    const target = event.target
    const tenant = target.querySelector('#tenant').value
    const secret = target.querySelector('#secret').value
    // let url = "http://back.app.cortijodemazas.com/tenant"
    const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/tenant"
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    var object = {};
    object["secret"]=secret;
    object["tenant"]=tenant;
    this.http.post<any>(url, object, {headers: headers}).subscribe( data =>
    {
      if(data){
        console.log(data)
        this.status = data.status
        this.createdTenant = data.tenant
        this.error = false
        if(data.jwt!=null){
          window.localStorage.setItem('jwt', data.jwt)
        }
        this.router.navigate(['body'])
      }
      else {
        console.log('Unautorized')

      }
    },
    error =>
    {
      this.error = true
      this.status = ""
    })
  }

  getUrl(){
    const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/logo"
    this.url=url
    }

}
