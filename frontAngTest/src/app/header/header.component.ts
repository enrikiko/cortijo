import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  active  : string  = "device";
  data    : any[]   = null;
  user    : string  = null;
  jwt     : any     = null;

  constructor(private http: HttpClient,
              private auth: AuthService) { }

  ngOnInit() {
    this.getUserFromJwtLocalStorage()
    this.auth.jwtEventEmitter().subscribe(jwt => this.changeJWT(jwt));
  }

  changeJWT(newJWT){
    this.jwt=newJWT
    this.getUser(this.jwt)
    this.active="device"
  }

  getUser(jwt){
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': jwt
      })
    let url = "http://back.app.cortijodemazas.com/jwt"
    this.http.get<any>(url, { headers: headers }).subscribe( data =>
      {
        if(data!=null){
          this.user=data.jwt;
        }
      })
  }

  camera(){this.active="camera"}
  device(){this.active="device"}
  task(){this.active="task"}
  config(){this.active="config"}
  sensor(){this.active="sensor"}
  files(){this.active="files"}
  wifi(){this.active="wifi"}
  requests(){this.active="requests"}
  photos(){this.active="photos"}
  users(){this.active="users"}
  logs(){this.active="logs"}

  logOut(){
    this.auth.logOut()
    this.active = "logOut"
    this.jwt    = null
    this.user   = null
  }

  getUserFromJwtLocalStorage(){
  const jwt = window.localStorage.getItem('jwt')
  const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
    })
  let url = "http://back.app.cortijodemazas.com/jwt"
  this.http.get<any>(url, { headers: headers }).subscribe( data =>
    {
      if(data!=null){
        this.user=data.jwt;
      }
    })
  }

}
