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
  status: String;

  constructor( private http: HttpClient ) { }

  ngOnInit() {
  }

  accion() {
    const host = "88.7.66.22"
    let url = "http://" + host + ":8010/newuser/"+this.userName+"/"+this.userPassword+"/"+this.password
    console.log(url)

    // this.http.post<any>(url,null,null).subscribe( data =>
    // {
    //   if(data){
    //     console.log(data)
    //     this.status = data.status
    //   }
    //   else {
    //     console.log('Unautorized')
    //     this.status = data.status
    //   }
    // })



  }

}
