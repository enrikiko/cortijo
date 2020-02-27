import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './canvasjs.min';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-wifi',
  templateUrl: './wifi.component.html',
  styleUrls: ['./wifi.component.css']
})
export class WifiComponent implements OnInit {

 wifis: any[]=["test_wifi","Cuarto2.4G","WifiSalon"];
 wifiData: any[]=null;

  constructor( private http: HttpClient ) { }

  ngOnInit() {
  }
  getData(wifi){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8000/wifi/" + wifi
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        this.wifiData = data
        console.log(this.wifiData)
        printGraphWifi(wifi, data)
      }
    })
  }

  printGraphWifi(name, data){
    let chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: false,
    exportEnabled: false,
    title: { text: name },
    data: [{
      type: "spline",
               color: "rgba(255,0,0,1)", //red
      dataPoints: data
    }]
  });

  chart.render();
  }

}
