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

  constructor() { }

  ngOnInit() {
  }

}
