import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  logs: any[]=null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getLogs()
  }

  getLogs(){
    // const host = (window.location.href.split("/")[2]).split(":")[0]
    const host = "88.8.71.214"
    let url = "http://" + host + ":8000/log"
    this.http.get<HttpResponse<object>>(url).subscribe( data =>
    {
      if(data!=null){
        //console.log(data)
        var res = data["response"]
        var list = []
        for(var index in res){list.push(index+"-"+res[index])}
        this.logs=(list);
      }
      else {
      console.log('No logs')
      }
    })
  }
}
