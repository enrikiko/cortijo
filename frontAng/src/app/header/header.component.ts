import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  active: string="device"

  constructor() { }

  ngOnInit() {
  }

  device(){this.active="device"}
  weather(){this.active="weather"}
  timer(){this.active="timer"}
  settings(){this.active="settings"}
  graphics(){this.active="graphics"}

}
