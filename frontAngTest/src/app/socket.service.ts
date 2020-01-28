import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Message } from './message';
import { Event } from './event';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})

export class SocketService {

  constructor(private socket: Socket) { }

  sendMessage(msg: string){
       this.socket.emit("message", msg);
   }

  getMessage() {
      return this.socket
           .fromEvent("message")
           .map( data => data.msg );
   }
}
