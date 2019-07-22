import { Injectable } from '@angular/core';

interface myData {
  success: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private status = false

  constructor() { };

  isLogin(){
    return this.status
  }

  login( user, password ) {
    if ( user=="Enrique" && password=="1234") {
      this.status = true
      return true
    }
    else {
      return false
    }
  }
}
