import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  active: string="device";
//  temperature: string="";
//  humidity: string="";
  data : any[]=null;
  jwt : string=null;

  constructor(private Http: HttpClient,
              private Auth: AuthService) { }

  ngOnInit() {
    this.getData()
    this.getJwt()
  }

  getData(){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    // const host = "88.8.65.164"
    let url = "http://" + host + ":8000/current/temperature/humidity"
    this.Http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        this.data=data;
      }
      else {
      console.log('Database is empty')
      }
    })
  }

  device(){this.active="device"}
  config(){this.active="config"}
  sensor(){this.active="sensor"}
  files(){this.active="files"}
  requests(){this.active="requests"}
  photos(){this.active="photos"}
  users(){this.active="users"}
  logs(){this.active="logs"}
  logOut(){
    this.Auth.logOut()
    this.active="logOut"
  }
  getJwt(){
  const jwt = window.localStorage.getItem('jwt')
  const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
    })
  const host = (window.location.href.split("/")[2]).split(":")[0]
  let url = "http://" + host + ":8000/jwt"
  this.Http.get<any>(url, { headers: headers }).subscribe( data =>
    {
      if(data!=null){
        this.jwt=data.jwt;
      }
      else {
      console.log('Database is empty')
      }
    })
  }

}
