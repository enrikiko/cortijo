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
showGraphic=true;

  constructor( private http: HttpClient ) { }

  ngOnInit() {
    this.getSensor()
  }

  getSensor(){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8000/all/sensor"
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        this.sensorList = data
      }
    })
  }

  getData(sensor){
    console.log(sensor)
      const host = (window.location.href.split("/")[2]).split(":")[0]
      let url = "http://" + host + ":8000/all/" + sensor.name + "/" + sensor.type
      sw
      this.http.get<HttpResponse<object>>(url).subscribe( data =>
      {
        if(data!=null){
          // var res = data["response"]
          var dataList = []
          var dataFormat
          for(var index in data){
            // list.push(index+"-"+res[index])
            dataFormat={ y: parseInt(data[index].humidity), label: new Date(parseInt(data[index].time)) }
            dataList.push(dataFormat)
          }
          this.printGraph(sensor.type, sensor.name, dataList);
          // console.log([{y:1},{y:2}])
          // console.log(temperature)
          // console.log(humidity)
        }
        else {
        console.log('No logs')
        }
      })
    }

    printGraph(type, name, data){
      let chart = new CanvasJS.Chart("chartContainer", {
  		animationEnabled: true,
  		exportEnabled: true,
  		title: { text: name },
  		data: [{
  			type: "spline",
                 color: "rgba(255,0,0,1)", //red
  			dataPoints: type
  		}]
  	});

  	chart.render();
    }

}
