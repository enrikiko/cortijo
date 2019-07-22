import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface myData {
  success: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private status = false

  constructor(private router: Router) { };

  isLogin(){
    return this.status
  }

  login( user, password ) {
    if ( user=="Enrique" && password=="1234") {
      this.router.navigate([''])
      this.status = true
      return true
    }
    else {
      return false
    }
  }

  logOut(){
    this.status = false
  }

}
