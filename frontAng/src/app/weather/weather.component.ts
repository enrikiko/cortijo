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
    // this.printGraph()

  }
  getData(){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    // const host = "88.8.71.214"
    let url = "http://" + host + ":8000/get/temperature/humidity/history"
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
          temp={ y: parseInt(data[index].temperature) }
          humi={ y: parseInt(data[index].humidity) }
          temperature.push(temp)
          humidity.push(humi)
        }
        this.printGraph(temperature, humidity);
        // console.log([{y:1},{y:2}])
        // console.log(temperature)
        // console.log(humidity)
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
		// title: { text: "Basic Column Chart in Angular" },
		data: [{
			type: "spline",
			dataPoints: temperature
		},
    {
      type: "spline",
      dataPoints: humidity
    }]
	});

	chart.render();
  }

}
