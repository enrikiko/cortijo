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

  private status = false

  constructor(private router: Router,
              private http: HttpClient ) { };

  isLogin(){
    return this.status
  }

  login( user, password ) {
      const host = "88.8.65.164"
      let url = "http://" + host + ":8010/user/"+ user + "/" + password
      this.http.get<any>(url).subscribe( data =>
      {
        if(data.status==true){
          console.log(data)
          this.status = true
          this.router.navigate([''])
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
