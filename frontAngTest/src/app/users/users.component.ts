import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  secret: String;
  userName: String;
  password: String;
  status: String;
  url = null;

  constructor(private router: Router,
              private http: HttpClient) { }

  ngOnInit() {
    this.getUrl()
  }

  logIn(){
    this.router.navigate(['login'])
  }

  createUser(event) {
    const target = event.target
    const user = target.querySelector('#userName').value
    const password = target.querySelector('#password').value
    const secret = target.querySelector('#secret').value
    let url = "https://back.app.cortijodemazas.com/auth"
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    var object = {};
    object["secret"]=secret;
    object["user"]=user;
    object["password"]=password;
    this.http.post<any>(url, object, {headers: headers}).subscribe( data =>
    {
      if(data){
        console.log(data)
        this.status = data.status
        if(data.jwt!=null){
          window.localStorage.setItem('jwt', data.jwt)
        }
        this.router.navigate(['body'])
      }
      else {
        console.log('Unautorized')
        this.status = data.status
      }
    })
  }

  getUrl(){
    const url = "https://back.app.cortijodemazas.com/logo"
    this.url=url
    }

}
