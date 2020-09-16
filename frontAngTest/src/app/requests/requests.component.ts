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
  //   const url = "http://back.app.cortijodemazas.com/device/all"
  //   const urlSocket = "http://back.app.cortijodemazas.com/websocketDevice/all"
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
    let url = "http://back.app.cortijodemazas.com/all/requests/" + device
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

  getRealTime(timestamp){
    var todate=new Date(timestamp).getDate();
    var tomonth=new Date(timestamp).getMonth()+1;
    var toyear=new Date(timestamp).getFullYear();
    var tohour=new Date(timestamp).getUTCHours();
    var tomin=new Date(timestamp).getUTCMinutes();
    var toseg=new Date(timestamp).getUTCSeconds();
    var original_date=tohour+':'+tomin+':'+toseg+ ' ' +tomonth+'/'+todate+'/'+toyear;
    return original_date
  }

  // getDeviceschanges(){
  //   let url = "http://back.app.cortijodemazas.com/all/deviceschanges"
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
