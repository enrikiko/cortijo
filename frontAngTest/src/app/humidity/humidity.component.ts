import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './canvasjs.min';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-humidity',
  templateUrl: './humidity.component.html',
  styleUrls: ['./humidity.component.css']
})
export class HumidityComponent implements OnInit {

logs: any[]=null;
sensorList: any[]=null;
showGraphic=true;
sensor:string=null;

  constructor( private http: HttpClient, private socketService: SocketService ) { }

  ngOnInit() {
    this.getSensor()
    this.socketService.getDataAlert().subscribe( (msg)=>{
      //console.log(msg)
      this.getData(this.sensor)
    } )
  }
  ngOnDestroy() {
    this.sensor=null
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

  wraperGetData(sensor){
    this.sensor=sensor
    this.getData(sensor)
  }

  getData(sensor){
      const host = (window.location.href.split("/")[2]).split(":")[0]
      let url = "http://" + host + ":8000/all/" + sensor.type + "/" + sensor.name
      switch(sensor.type) {
        case "humidity":
          this.getHumidity(url, sensor.name)
          // code block
          break;
        case "temperature":
        this.getTemperature(url, sensor.name)
          // code block
          break;
        default:
          console.log("switch default")
      }
    }

    getHumidity(url, name){
      this.http.get<HttpResponse<object>>(url).subscribe( data =>
      {
        if(data!=null){
          var dataList = []
          var dataFormat
          for(var index in data){
            dataFormat={ y: parseInt(data[index].humidity), label: new Date(parseInt(data[index].time)) }
            dataList.push(dataFormat)
          }
          this.printGraphHumidity(name, dataList);
        }
        else {
          console.log("No logs")
        }
      })
    }

    getTemperature(url, name){
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
          this.printGraphTemperature(name, temperature, humidity);
        }
        else {
        console.log('No logs')
        }
      })
    }

    printGraphHumidity(name, data){
      let chart = new CanvasJS.Chart("humidityGraph", {
  		animationEnabled: false,
  		exportEnabled: false,
  		title: { text: name },
  		data: [{
  			type: "spline",
                 color: "rgba(255,0,0,1)", //red
  			dataPoints: data
  		}]
  	});

  	chart.render();
    }

    printGraphTemperature(name, temperature, humidity){
      let chart = new CanvasJS.Chart("humidityGraph", {
  		animationEnabled: false,
  		exportEnabled: false,
  		title: { text: name },
  		data: [
        {
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
