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

  constructor() { private http: HttpClient }

  ngOnInit() {
    this.getData()
    this.printGraph()

  }
  getData(){
    // const host = (window.location.href.split("/")[2]).split(":")[0]
    const host = "88.8.71.214"
    let url = "http://" + host + ":8000/log"
    this.http.get<HttpResponse<object>>(url).subscribe( data =>
    {
      if(data!=null){
        //console.log(data)
        var res = data["response"]
        var list = []
        for(var index in res){list.push(index+"-"+res[index])}
        this.logs=(list);
      }
      else {
      console.log('No logs')
      }
    })
  }
  printGraph(){
    let chart = new CanvasJS.Chart("chartContainer", {
		animationEnabled: true,
		exportEnabled: true,
		// title: { text: "Basic Column Chart in Angular" },
		data: [{
			type: "spline",
			dataPoints: [
				{ y: 71, label: "Apple" },
				{ y: 55, label: "Mango" },
				{ y: 50, label: "Orange" },
				{ y: 65, label: "Banana" },
				{ y: 95, label: "Pineapple" },
				{ y: 68, label: "Pears" },
				{ y: 28, label: "Grapes" },
				{ y: 34, label: "Lychee" },
				{ y: 14, label: "Jackfruit" }
			]
		},
    {
      type: "spline",
      dataPoints: [
        { y: 61, label: "Apple" },
        { y: 45, label: "Mango" },
        { y: 40, label: "Orange" },
        { y: 55, label: "Banana" },
        { y: 85, label: "Pineapple" },
        { y: 58, label: "Pears" },
        { y: 18, label: "Grapes" },
        { y: 24, label: "Lychee" },
        { y: 4, label: "Jackfruit" }
      ]
    }]
	});

	chart.render();
  }

}
