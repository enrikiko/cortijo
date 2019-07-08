import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  active: string="device";
//  temperature: string="";
//  humidity: string="";
  data : any[]=null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getData()
  }

  getData(){
    // const host = (window.location.href.split("/")[2]).split(":")[0]
    const host = "88.8.71.214"
    let url = "http://" + host + ":8000/get/temperature/humidity"
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        this.data=data;
      }
      else {
      console.log('Database is empty')
      }
    })
  }

  device(){this.active="device"}
  weather(){this.active="weather"}
  timer(){this.active="timer"}
  settings(){this.active="settings"}
  graphics(){this.active="graphics"}
  logs(){this.active="logs"}


}
