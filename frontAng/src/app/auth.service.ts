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
      const host = "88.8.35.161"
      let url = "http://" + host + ":8010/user/"+ user + "/" + password
      this.http.get(url).subscribe( data =>
      {
        if(data!=null){
          // for(let index in data){
          //   console.log(data[index])
          // }
          console.log(data)
        }
        else {
        console.log('Database is empty')
        }
      })
    
  }

  logOut(){
    this.status = false
  }

}
