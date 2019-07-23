import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userName: String = "";
  password: String = "";

  constructor( private Auth: AuthService,
               private http: HttpClient ) { }

  ngOnInit() { }

  login(event){
    //let user = this.userName
    //let password = this.password
    event.preventDefault()
    const target = event.target
    const user = target.querySelector('#userName').value
    const password = target.querySelector('#password').value
    this.Auth.login(user, password)
  }

}
