import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  active: string="device"
  temperature: string=""
  humidity: string=""

    constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getData()
  }

  getData(){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8000/all"
    this.http.get(url).subscribe( data =>
    {
      if(data!=null){
        // for(let index in data){
        //   console.log(data[index])
        // }
        this.temperature=data.temperature;
        this.humidity=data.humidity;
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

}
