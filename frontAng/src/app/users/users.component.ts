import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  password: String;
  userName: String;
  userPassword: String;
  status: Boolean;

  constructor( private http: HttpClient ) { }

  ngOnInit() {
  }

  accion() {
    const host = "88.7.66.22"
    let url = "http://" + host + ":8010/newuser/"+this.userName+"/"+this.userPassword+"/"+this.password
    console.log(url)

    this.http.post<String>(url).subscribe( data =>
    {
      if(data){
        //console.log(data)
        this.status = true
        return true
      }
      else {
      console.log('Unautorized')
      return false
      }
    })



  }

}
