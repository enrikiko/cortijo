import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import {AppConfiguration} from '../set_configuration/app-configuration';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  secret: String;
  tenant: String;
  userName: String;
  password: String;
  status: String;
  error: Boolean;
  createdUser: String;
  url = null;

  constructor(private router: Router,
              private auth: AuthService,
              private http: HttpClient,
              private appConfig: AppConfiguration) { }

  ngOnInit() {
    this.getUrl()
    this.auth.statusEventEmitter().subscribe(status => this.changeLoginResult(status));
  }

  logIn(){
    this.router.navigate(['login'])
  }

  newTenant(){
    this.router.navigate(['tenants'])
  }

  createUser(event) {
    const target = event.target
    const tenant = target.querySelector('#tenant').value
    const user = target.querySelector('#userName').value
    const password = target.querySelector('#password').value
    const secret = target.querySelector('#secret').value
    const url = "http://" + this.appConfig.back_url + "/auth"
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    var object = {};
    object["secret"]=secret;
    object["tenant"]=tenant;
    object["user"]=user;
    object["password"]=password;
    this.http.post<any>(url, object, {headers: headers}).subscribe( data =>
    {
      if(data){
        console.log(data)
        this.status = data.status
        this.createdUser = data.createdUser
        this.error = false
        if(data.jwt!=null){
          window.localStorage.setItem('jwt', data.jwt)
          const loginResult = this.auth.login(tenant, user, password)
        }
        this.router.navigate(['body'])
      }
      else {
        console.log('Unautorized')
        this.status = data.status
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

  changeLoginResult(loginSuccess){
      if(loginSuccess)
      {
        this.router.navigate(['devices'])
      }else{
        console.log("loginFail");
      }
    }
}
