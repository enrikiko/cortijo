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
    this.http.get(url, { headers: headers }).subscribe( data => {
      if(data!=null){
        console.log(data)
      }
    })
    return true
  }

  isLogin(){
    if(this.authJWT()==true){this.status==true}
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
          console.log(data)
          this.status = true
          this.router.navigate(['logs'])
          return true
        }
        else {
          console.log('Unautorized')
          return false
        }
      })

  }

  logOut(){
    this.status = false
  }

}
