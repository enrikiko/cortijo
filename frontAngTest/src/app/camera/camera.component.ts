import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {

  url: string = "88.8.36.129";
  password: string = "tfuvjk765frvlnj";
  user : string = "admin";
  autoPlay: string = "http://"+this.url+":8000/StrobeMediaPlayback.swf"
  flashvars: string = "&amp;src=rtmp://"+this.url+":9981/flash/11:"+this.user+":"+this.password+"&amp;autoHideControlBar=true&amp;streamType=live&amp;autoPlay=true"


  constructor() { }

  ngOnInit() {
  }

}
