import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { SocketService } from '../socket.service';
import { AuthService } from '../auth.service';
import { Message } from '../message';
import { Event } from '../event';
import {AppConfiguration} from '../set_configuration/app-configuration';


@Component({
  selector: 'app-body',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {

  webSocketDevices: any[] = null;
  devices: any[] = null;
  sensors: any[] = null;
  lapse: number = null;
  lapse_time: number = 10;
  messages: Message[] = [];
  ioConnection: any;
  subscription: any;
  status: Boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private socketService: SocketService,
    private auth: AuthService,
    private appConfig: AppConfiguration ) { }



  //------WebSocker-------//
  initIoConnection(){
    this.socketService.sendMessage("Angular user connected");
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
    this.subscription = this.socketService.getDeviceSocketAlert().subscribe( (msg)=>{
      this.getWebSocketDeviceList()
    } )
    this.auth.statusEventEmitter().subscribe(status => this.changeLoginResult(status))
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  changeLoginResult(status){this.status=status}

  changeStatus(device){
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
    })
    let url = null
    if(device.status){
     url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/update/" + device.name +"/false/"
    }
    else if (!device.status){
      url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/update/" + device.name +"/true/"+ this.lapse_time*60000
    }
    let startTime = new Date().getTime()
    this.http.get(url, { headers: headers }).subscribe( data =>
    {
      if(data!=null){
        let finishTime = new Date().getTime()
        this.getDifference(startTime, finishTime)
        //this.getDevicesList()
      }
      else {
      // console.log('no response')
      }
    })
  }
  requestsDevice(device){
    this.router.navigate(['requests/'+device])
  }

  deleteDevice(device){
    if (confirm("Delete " + device.name + "?")) {
      const jwt = window.localStorage.getItem('jwt')
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': jwt
      })
      const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/device/" + device.name
      this.http.delete(url, { headers: headers }).subscribe( data =>
      {
        if(data!=null){
          //this.getDevicesList()
        }
      })
    }
  }

  getDifference(startTime, finishTime){
    let lapse = finishTime - startTime
    this.lapse = lapse
  }

  getWebSocketDeviceList(){
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
      })
    const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/websocketDevice/all"
    this.http.get<any[]>(url, { headers: headers }).subscribe( data =>
    {
      if(data!=null){
        this.webSocketDevices=data;

      }
      else {
      console.log('Database is empty')
      }
    })
  }

  changeWebSocketStatus(device){
    //console.log(device);
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
    })
    let url = null
    if(device.status){
      url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/updateWebSocket/" + device.name + "/" + device.id + "/false"
    }
    else if (!device.status){
      url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/updateWebSocket/" + device.name + "/" + device.id + "/true"
    }
    let startTime = new Date().getTime()
    this.http.get(url, { headers: headers }).subscribe( data =>
    {
      if(data!=null){
        let finishTime = new Date().getTime()
        this.getDifference(startTime, finishTime)
        console.log(data);

        //this.getWebSocketDeviceList()
      }
      else {
      // console.log('no response')
      }
    })
  }

  getDevicesList(){
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
    })
    const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/device/all"
    this.http.get<any[]>(url, { headers: headers }).subscribe( data =>
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
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
    })
    const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/sensor/all"
    this.http.get<any[]>(url, { headers: headers }).subscribe( data =>
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

      const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/sensor/" + sensor.name
      this.http.delete(url, { headers: headers }).subscribe( data =>
      {
        if(data!=null){
          this.getSensorList()
        }
      })
    }
  }

  settingSensor(sensor){
    this.router.navigate(['sensorSetting/'+sensor])
  }

  infoSensor(sensor){
    this.router.navigate(['sensorInfo/'+sensor])
  }


}
