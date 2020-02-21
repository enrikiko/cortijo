import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class SocketService {

  constructor(private socket: Socket) { }

  sendMessage(msg: string){
       this.socket.emit("event", msg);
   }

  getMessage() {
      return this.socket.fromEvent("user").pipe(map( data => data ));
   }
}
