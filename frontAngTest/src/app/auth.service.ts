import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

interface myData {
  success: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private status = false;

  constructor(private router: Router,
              private http: HttpClient ) { };

  authJWT(){
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
    })
    const host = (window.location.href.split("/")[2]).split(":")[0]
    const url = "http://" + host + ":8000/jwt"
    var status = false
    this.http.get<any>(url, { headers: headers }).subscribe( data => {
      if(data!=null){
        if(data.status){
          //this.router.navigate([''])
          this.status = true
          console.log(1)
        }
      }
      status = true
    })
    //var x = 0
    //while(!status){console.log(x); x++}
    console.log(2)
    console.log(status)
    return false
  }

  isLogin(){
    this.authJWT()
    return this.status
  }

  login( user, password ) {
      const host = (window.location.href.split("/")[2]).split(":")[0]
      // const host = "88.8.65.164"
      let url = "http://" + host + ":8000/auth/"+ user + "/" + password
      this.http.get<any>(url).subscribe( data =>
      {
        if(data.status==true){
          window.localStorage.setItem('jwt', data.jwt)
          this.status = true
          this.router.navigate([''])
        }
        else {
          console.log('Unautorized')
        }
      })

  }

  logOut(){
    this.status = false
    window.localStorage.setItem('jwt', null)
  }

}
