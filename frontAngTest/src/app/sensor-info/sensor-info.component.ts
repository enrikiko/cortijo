import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sensor-info',
  templateUrl: './sensor-info.component.html',
  styleUrls: ['./sensor-info.component.css']
})
export class SensorInfoComponent implements OnInit {

  constructor( private route: ActivatedRoute ) { }

  sensor:string=null;

  ngOnInit() {
    this.sensor = this.route.snapshot.queryParamMap.get('sensor');
    console.log(this.sensor)
  }

}
