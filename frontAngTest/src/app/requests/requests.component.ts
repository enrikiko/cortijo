import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  requests: any[]=null;
  //deviceList: any[]=null;
  //deviceSocketList: any[]=null;
  device: string=null;

  constructor(
    private router: Router,
    private http: HttpClient) { }

  ngOnInit() {
    this.device = this.router.url.split("/")[2]
    this.getDeviceschangesByDevice(this.device)
    //this.getDeviceschanges()
    //this.getDevices()
  }

  // getDevices(){
  //   const url = "https://back.app.cortijodemazas.com/device/all"
  //   const urlSocket = "https://back.app.cortijodemazas.com/websocketDevice/all"
  //   this.http.get<any[]>(url).subscribe( data =>
  //   {
  //     if(data!=null){
  //       this.deviceList=data;
  //     }
  //     else {
  //     console.log('Database is empty')
  //     }
  //   })
  //   this.http.get<any[]>(urlSocket).subscribe( data =>
  //   {
  //     if(data!=null){
  //       this.deviceSocketList=data;
  //     }
  //     else {
  //     console.log('Database is empty')
  //     }
  //   })
  // }

  getDeviceschangesByDevice(device){
    let url = "https://www.back.app.cortijodemazas.com/all/requests/" + device
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        this.requests=data;
      }
    })
  }

  getRealTime(timestam){
    var data = parseInt(timestam)
    var todate = new Date(data).getDate();
    var tomonth = new Date(data).getMonth()+1;
    var toyear = new Date(data).getFullYear();
    var tohour = new Date(data).getUTCHours();
    var tomin = new Date(data).getUTCMinutes();
    var toseg = new Date(data).getUTCSeconds();
    return tohour + ':' + tomin + ':' + toseg + ' ' + tomonth + '/' + todate + '/' +toyear;
  }

  toSegOrMin(min){
    if (min >= 2){ return min + " minutes"}
    else if ( min < 2 ){ return min*60 + " seconds" }
  }

  // getDeviceschanges(){
  //   let url = "https://back.app.cortijodemazas.com/all/deviceschanges"
  //   this.http.get<any[]>(url).subscribe( data =>
  //   {
  //     if(data!=null){
  //       console.log(data)
  //       this.requests=data;
  //     }
  //     else {
  //     console.log('No logs')
  //     }
  //   })
  // }

}
