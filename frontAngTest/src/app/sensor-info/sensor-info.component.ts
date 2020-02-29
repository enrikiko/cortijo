import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-sensor-info',
  templateUrl: './sensor-info.component.html',
  styleUrls: ['./sensor-info.component.css']
})
export class SensorInfoComponent implements OnInit {

  constructor(
    private router: Router,
    private http: HttpClient ) { }

  sensor:string=null;
  sensorInfo:any=null;

  ngOnInit() {
    this.sensor = this.router.url.split("/")[2]
    this.getInfo(this.sensor)
  }

  getInfo(sensor){
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
    })
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8000/sensor/" + sensor
    this.http.get(url, { headers: headers }).subscribe( data =>
    {
      if(data!=null){
        this.sensorInfo=data
        console.log(this.sensorInfo)
      }
    })
  }

  addDevice(){
    this.sensorInfo.devices.push("")
  }
  removeDevice(device){
    const index = this.sensorInfo.devices.indexOf(device);
      if (index > -1) {
          this.sensorInfo.devices.splice(index, 1);
      }
  }

}
