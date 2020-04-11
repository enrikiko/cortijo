import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {

  autoPlay: string = '<embed src="http://88.8.36.129:8000/StrobeMediaPlayback.swf" width="1280" height="720" quality="high" bgcolor="#000000" name="StrobeMediaPlayback" allowfullscreen="true" pluginspage="http://www.adobe.com/go/getflashplayer" flashvars="&amp;src=rtmp://88.8.36.129:9981/flash/11:admin:tfuvjk765frvlnj&amp;autoHideControlBar=true&amp;streamType=live&amp;autoPlay=true" type="application/x-shockwave-flash">';
  active: string="camera1";

  constructor() { }

  ngOnInit() {
  }

  camera1(){
    this.active="camera1";
    this.autoPlay='<embed src="http://88.8.36.129:8000/StrobeMediaPlayback.swf" width="1280" height="720" quality="high" bgcolor="#000000" name="StrobeMediaPlayback" allowfullscreen="true" pluginspage="http://www.adobe.com/go/getflashplayer" flashvars="&amp;src=rtmp://88.8.36.129:9981/flash/11:admin:tfuvjk765frvlnj&amp;autoHideControlBar=true&amp;streamType=live&amp;autoPlay=true" type="application/x-shockwave-flash">'
  }
  camera2(){
    this.active="camera2";
    this.autoPlay='<embed src="http://88.8.36.129:8000/StrobeMediaPlayback.swf" width="1280" height="720" quality="high" bgcolor="#000000" name="StrobeMediaPlayback" allowfullscreen="true" pluginspage="http://www.adobe.com/go/getflashplayer" flashvars="&amp;src=rtmp://88.8.36.129:9981/flash/11:admin:tfuvjk765frvlnj&amp;autoHideControlBar=true&amp;streamType=live&amp;autoPlay=true" type="application/x-shockwave-flash">'}

}
