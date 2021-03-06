import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import {AppConfiguration} from '../set_configuration/app-configuration';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userName:     String  = "";
  password:     String  = "";
  tenant:     String  = "";
  loginFail:    Boolean = false;
  loginSuccess: Boolean = false;
  url                   = null;

  constructor( private router: Router,
               private auth: AuthService,
               private http: HttpClient,
               private appConfig: AppConfiguration) { }

  ngOnInit() {
  this.getUrl()
  this.auth.statusEventEmitter().subscribe(status => this.changeLoginResult(status));

}
  singIn(){
    this.router.navigate(['users'])
  }

  newTenant(){
    this.router.navigate(['tenants'])
  }

  changeLoginResult(loginSuccess){
    if(loginSuccess)
    {
      this.loginSuccess = true
      this.router.navigate(['devices'])
    }else{
      this.loginFail = true
      console.log("loginFail");
      console.log(this.loginFail);


    }
  }

  login(event){
    //let user = this.userName
    //let password = this.password
    event.preventDefault()
    const target = event.target
    const user = target.querySelector('#userName').value
    const password = target.querySelector('#password').value
    const tenant = target.querySelector('#tenant').value
    const loginResult = this.auth.login(tenant, user, password)

  }
  getUrl(){
    const url = "http://" + this.appConfig.back_url + "/logo"
    this.url=url
    }

}
