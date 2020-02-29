import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sensor-info',
  templateUrl: './sensor-info.component.html',
  styleUrls: ['./sensor-info.component.css']
})
export class SensorInfoComponent implements OnInit {

  constructor( private router: Router ) { }

  sensor:string=null;

  ngOnInit() {
    this.sensor = this.router.url
    console.log(this.sensor)
  }

}
