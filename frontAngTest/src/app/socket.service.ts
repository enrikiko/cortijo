import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class SocketService {

  constructor(private socket: Socket) { }

  sendMessage(msg: string){
       this.socket.emit("event_angular", msg);
   }

  getDeviceAlert() {
      return this.socket.fromEvent("alert_device").pipe(map( data => data ));
   }

   getDeviceSocketAlert() {
       return this.socket.fromEvent("alert_device_socket").pipe(map( data => data ));
    }

  getWifiAlert() {
      return this.socket.fromEvent("alert_wifi").pipe(map( data => data ));
   }

   getDataAlert() {
      return this.socket.fromEvent("alert_data").pipe(map( data => data ));
   }
}
