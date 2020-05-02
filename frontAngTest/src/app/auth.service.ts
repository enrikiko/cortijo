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
  private certain = false;

  constructor(private router: Router,
              private http: HttpClient ) { };

  authJWT(){
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
      })
    const url = "http://back.app.cortijodemazas.com/jwt"
    this.http.get<any>(url, { headers: headers }).subscribe( data => {
      if(data!=null){
        if(data.status){
          this.router.navigate([""])
          this.status = true
        }
      }
    })
  }

  isLogin(){
    if(!this.certain){
      this.authJWT()
      this.certain=true
    }
    return this.status
  }

  login( user, password ) {
      const host = (window.location.href.split("/")[2]).split(":")[0]
      // const host = "88.8.65.164"
      let url = "http://" + host + ":8000/auth"
      let object={}
      object["user"]=user;
      object["password"]=password;
      this.http.put<any>(url, object).subscribe( data =>
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
