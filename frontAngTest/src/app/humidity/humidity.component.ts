import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './canvasjs.min';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-humidity',
  templateUrl: './humidity.component.html',
  styleUrls: ['./humidity.component.css']
})
export class HumidityComponent implements OnInit {

logs: any[]=null;
sensorList: any[]=null;

  constructor( private http: HttpClient ) { }

  ngOnInit() {
    this.getData();
    this.getSensor()
  }

  getSensor(){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8000/all/sensor"
    this.http.get<HttpResponse<object>>(url).subscribe( data =>
    {
      if(data!=null){
        this.sensorList = data
      }
    }
  }
  getData(){
      const host = (window.location.href.split("/")[2]).split(":")[0]
      let url = "http://" + host + ":8000/all/sensorHumidity/humidity"
      this.http.get<HttpResponse<object>>(url).subscribe( data =>
      {
        if(data!=null){
          // var res = data["response"]
          var humidity = []
          var humi
          for(var index in data){
            // list.push(index+"-"+res[index])
            humi={ y: parseInt(data[index].humidity), label: new Date(parseInt(data[index].time)) }
            humidity.push(humi)
          }
          this.printGraph(humidity);
          // console.log([{y:1},{y:2}])
          // console.log(temperature)
          // console.log(humidity)
        }
        else {
        console.log('No logs')
        }
      })
    }
    printGraph(humidity){
      let chart = new CanvasJS.Chart("chartContainer", {
  		animationEnabled: true,
  		exportEnabled: true,
  		title: { text: "Laptop-room humidity" },
  		data: [{
  			type: "spline",
                 color: "rgba(255,0,0,1)", //red
  			dataPoints: humidity
  		}]
  	});

  	chart.render();
    }

}
