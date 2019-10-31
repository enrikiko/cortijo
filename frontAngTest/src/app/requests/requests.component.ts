import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  requests: any[]=null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getRequests()
  }

  getRequests(){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8000/all/watering"
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        console.log(data)
        this.requests=data;
      }
      else {
      console.log('No logs')
      }
    })
  }

}
