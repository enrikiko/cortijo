import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { SocketService } from '../socket.service';
import { Message } from '../message';
import { Event } from '../event';


@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  webSocketDevices: any[] = null;
  devices: any[] = null;
  sensors: any[] = null;
  lapse: number = null;
  lapse_time: number = 5;
  messages: Message[] = [];
  ioConnection: any;
  subscription: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private socketService: SocketService ) { }



  //------WebSocker-------//
  initIoConnection(){
    this.socketService.sendMessage("angular user connected");
  }

  ngOnInit()
  {
    this.getWebSocketDeviceList()
    this.getDevicesList()
    this.getSensorList()
    this.initIoConnection()
    this.subscription = this.socketService.getDeviceAlert().subscribe( (msg)=>{
      this.getDevicesList()
    } )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  changeStatus(device){
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
    })
    let newStatus=null
    let url = null
    if(device.status){
      url = "http://back.app.cortijodemazas.com/update/" + device.name +"/false/"
    }
    else if (!device.status){
      url = "http://back.app.cortijodemazas.com/update/" + device.name +"/true/"+ this.lapse_time*60000
    }
    let startTime = new Date().getTime()
    this.http.get(url, { headers: headers }).subscribe( data =>
    {
      if(data!=null){
        let finishTime = new Date().getTime()
        this.getDifference(startTime, finishTime)
        this.getDevicesList()
      }
      else {
      // console.log('no response')
      }
    })
  }

  deleteDevice(device){
    if (confirm("Delete " + device.name + "?")) {
      const jwt = window.localStorage.getItem('jwt')
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': jwt
      })
      let url = "http://back.app.cortijodemazas.com/device/" + device.name
      this.http.delete(url, { headers: headers }).subscribe( data =>
      {
        if(data!=null){
          this.getDevicesList()
        }
      })
    }
  }

  getDifference(startTime, finishTime){
    let lapse = finishTime - startTime
    this.lapse = lapse
  }

  getWebSocketDeviceList(){
    let url = "http://back.app.cortijodemazas.com/websocketDevice/all"
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        this.webSocketDevices=data;
        console.log(data);

      }
      else {
      console.log('Database is empty')
      }
    })
  }

  getDevicesList(){
    let url = "http://back.app.cortijodemazas.com/device/all"
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        this.devices=data;
      }
      else {
      console.log('Database is empty')
      }
    })
  }

  getSensorList(){
    let url = "http://back.app.cortijodemazas.com/sensor/all"
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        this.sensors=data;
      }
      else {
      console.log('Database is empty')
      }
    })
  }


  deleteSensor(sensor){
    if (confirm("Delete " + sensor.name + "?")) {
      const jwt = window.localStorage.getItem('jwt')
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': jwt
      })

      let url = "http://back.app.cortijodemazas.com/sensor/" + sensor.name
      this.http.delete(url, { headers: headers }).subscribe( data =>
      {
        if(data!=null){
          this.getSensorList()
        }
      })
    }
  }

  infoSensor(sensor){
    this.router.navigate(['sensor/'+sensor])
  }


}
