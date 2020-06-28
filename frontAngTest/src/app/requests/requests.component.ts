import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  requests: any[]=null;
  deviceList: any[]=null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getDeviceschanges()
    this.getDevices()
  }

  getDevices(){
    let url = "http://back.app.cortijodemazas.com/device/all"
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        this.deviceList=data;
      }
      else {
      console.log('Database is empty')
      }
    })
  }

  getDeviceschangesByDevice(device){
    let url = "http://back.app.cortijodemazas.com/all/deviceschanges/" + device
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

  getDeviceschanges(){
    let url = "http://back.app.cortijodemazas.com/all/deviceschanges"
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
