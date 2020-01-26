import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { SocketService } from '../socket.service';
import { Message } from '../message';

const enum Event {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect'
}

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  devices: any[] = null;
  lapse: number = null;
  lapse_time: number = 5;
  messages: Message[] = [];
  ioConnection: any;

  constructor(private http: HttpClient,private socketService: SocketService) { }

  ngOnInit()
  {
    this.getDevicesList()
  }

  changeStatus(device){
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
    })
    let newStatus=null
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = null
    if(device.status){
      url = "http://" + host + ":8000/update/" + device.name +"/false/"
    }
    else if (!device.status){
      url = "http://" + host + ":8000/update/" + device.name +"/true/"+ this.lapse_time*60000
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
      const host = (window.location.href.split("/")[2]).split(":")[0]
      let url = "http://" + host + ":8000/device/" + device.name
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

  getDevicesList(){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8000/all/device"
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


  //------WebSocker-------//

   initIoConnection(){
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        //this.messages.push(message);
        console.log(message)
      });

    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

}
