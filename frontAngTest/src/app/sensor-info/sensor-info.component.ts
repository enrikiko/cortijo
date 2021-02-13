import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {AppConfiguration} from '../set_configuration/app-configuration';


@Component({
  selector: 'app-sensor-info',
  templateUrl: './sensor-info.component.html',
  styleUrls: ['./sensor-info.component.css']
})
export class SensorInfoComponent implements OnInit {

  constructor(
    private router: Router,
    private http: HttpClient,
    private appConfig: AppConfiguration ) { }

  sensor:string = null;
  sensorInfo:any = null;
  avaliableDevices:any[] = null;
  selectedDevice:any = null;

  ngOnInit() {
    this.sensor = this.router.url.split("/")[2]
    this.getInfo(this.sensor)
    this.getAvaliableDevices()
  }

  getInfo(sensor){
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
    })
    const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/sensor/" + sensor
    this.http.get(url, { headers: headers }).subscribe( data =>
    {
      if(data!=null){
        this.sensorInfo=data
      }
    })
  }

  addDevice(){
    //console.log("devices: " + this.selectedDevice);

    this.sensorInfo.devices.push(this.selectedDevice)
  }

  removeDevice(device){
    const index = this.sensorInfo.devices.indexOf(device);
      if (index > -1) {
          this.sensorInfo.devices.splice(index, 1);
      }
  }

  change(){}

  selected(e){
    this.selectedDevice.setValue(e.target.value, {
      onlySelf: true
    })
  }

  getAvaliableDevices(){
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
    })
    const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/device/all"
    this.http.get<any[]>(url, { headers: headers }).subscribe( data =>
    {
      if(data!=null){
        this.avaliableDevices=data;
      }
    })
  }

}
