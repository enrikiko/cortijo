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
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8000/log"
    this.http.get(url).subscribe( data =>
    {
      if(data!=null){
        var response=data.response
        //console.log(response)
        var list = []
        for(var index in response){list.push(index+"-"+response[index])}
        this.logs=(list);
      }
      else {
      console.log('No logs')
      }
    })
  }
}
