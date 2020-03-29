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

  createUser(event) {
    // const host = "88.7.66.22"
    const target = event.target
    const user = target.querySelector('#userName').value
    const password = target.querySelector('#password').value
    const secret = target.querySelector('#secret').value
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8000/auth"
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    var object = {};
    object.secret=secret;
    object.user=user;
    object.password=password;
    this.http.post<Object>(url, object, {headers: headers}).subscribe( data =>
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
    const host = (window.location.href.split("/")[2]).split(":")[0]
    const url = "http://" + host + ":8000/logo"
    this.url=url
    }

}
