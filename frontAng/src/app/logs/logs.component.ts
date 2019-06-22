import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  logs: string="";

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getLogs()
  }

  getLogs(){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8000/log"
    this.http.get(url).subscribe( data =>
    {
      if(data!=null){
        console.log(data)
        this.logs=JSON.stringify(data);
      }
      else {
      console.log('No logs')
      }
    })
  }
}
