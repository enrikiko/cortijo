import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './canvasjs.min';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  logs: any[]=null;

  constructor( private http: HttpClient ) { }

  ngOnInit() {
    this.getData()
  }
  getData(){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    // const host = "88.8.65.164"
    let url = "http://" + host + ":8000/all/sensorMock/temperature"
    this.http.get<HttpResponse<object>>(url).subscribe( data =>
    {
      if(data!=null){
        // var res = data["response"]
        var temperature = []
        var humidity = []
        var temp
        var humi
        for(var index in data){
          // list.push(index+"-"+res[index])
          temp={ y: parseInt(data[index].temperature), label: new Date(parseInt(data[index].time)) }
          humi={ y: parseInt(data[index].humidity), label: new Date(parseInt(data[index].time)) }
          temperature.push(temp)
          humidity.push(humi)
        }
        this.printGraph(temperature, humidity);
      }
      else {
      console.log('No logs')
      }
    })
  }
  printGraph(temperature, humidity){
    let chart = new CanvasJS.Chart("chartContainer", {
		animationEnabled: true,
		exportEnabled: true,
		title: { text: "sensorMock" },
		data: [{
			type: "spline",
               color: "rgba(255,0,0,1)", //red
			dataPoints: temperature
		},
         {
                type: "splineArea",
                color: "rgba(0,75,141,0.3)", //Blue
                dataPoints: humidity
         }]
	});

	chart.render();
  }

}
