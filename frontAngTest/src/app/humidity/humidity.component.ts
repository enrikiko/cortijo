import { Component, OnInit } from '@angular/core';
//import * as CanvasJS from './canvasjs.min';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { SocketService } from '../socket.service';
import Chart from 'chart.js';

@Component({
  selector: 'app-humidity',
  templateUrl: './humidity.component.html',
  styleUrls: ['./humidity.component.css']
})
export class HumidityComponent implements OnInit {

logs:any[]=null;
sensorList:any[]=null;
showGraphic=true;
sensor:string=null;
subscription:any;

  constructor( private http: HttpClient, private socketService: SocketService ) { }

  ngOnInit() {
    this.getSensor()
    this.subscription = this.socketService.getDataAlert().subscribe( (msg)=>{
      if(this.sensor){
        this.getData(this.sensor)
      }
    })
  }
  ngOnDestroy() {
    this.sensor=null
    this.subscription.unsubscribe()
  }

  getSensor(){
    let url = "http://back.app.cortijodemazas.com/sensor/all"
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
      let url = "http://back.app.cortijodemazas.com/all/" + sensor.type + "/" + sensor.name
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
          var labelList = []
          var dataFormat
          var label
          for(var index in data){
            dataFormat = parseInt(data[index].humidity)
            dataList.push(dataFormat)
            label = new Date(parseInt(data[index].time))
            labelList.push(label.getDate())
          }
          this.printGraphHumidity(name, dataList, labelList);
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
          var temperature = []
          var humidity = []
          var labelList = []
          var temp
          var humi
          var label
          for(var index in data){
            temp = parseInt(data[index].temperature)
            humi = parseInt(data[index].humidity)
            temperature.push(temp)
            humidity.push(humi)
            label = new Date(parseInt(data[index].time))
            labelList.push(label.getDate())
          }
          this.printGraphTemperature(name, temperature, humidity, labelList);
        }
        else {
        console.log('No logs')
        }
      })
    }

    printGraphHumidity(name, dataList, labelList){
    //   let chart = new CanvasJS.Chart("humidityGraph", {
  	// 	animationEnabled: false,
  	// 	exportEnabled: false,
  	// 	title: { text: name },
  	// 	data: [{
  	// 		type: "spline",
    //              color: "rgba(255,0,0,1)", //red
  	// 		dataPoints: data
  	// 	}]
  	// });
    //
  	// chart.render();
      var ctx = document.getElementById('humidityGraph');
      var myChart = new Chart(ctx, {
          type: 'line',
          data: {
              datasets: [{
                  label: name,
                  data: dataList,
                  fill: true,
                  borderColor: "#36a2eb",
                  //fillColor: "#36a2eb",
                  //strokeColor : "#000000",
                  //background: "#36a2eb",
                  backgroundColor: "rgba(54, 162, 235, 0.3)",
                  // pointBackgroundColor: "rgba(54, 162, 235, 0.3)",
              }],
              labels: labelList
          },
          options: {
            animation: {
                duration: 0
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        beginAtZero: true,
                    }
                }]
            },
            elements: {
                      point:{
                          radius: 0
                      }
                  }
          }
      });
    }

    printGraphTemperature(name, temperature, humidity, labelList){
    //   let chart = new CanvasJS.Chart("humidityGraph", {
  	// 	animationEnabled: false,
  	// 	exportEnabled: false,
  	// 	title: { text: name },
  	// 	data: [
    //     {
    // 			type: "spline",
    //       color: "rgba(255,0,0,1)", //red
    // 			dataPoints: temperature
  	// 	  },
    //     {
    //       type: "splineArea",
    //       color: "rgba(0,75,141,0.3)", //Blue
    //       dataPoints: humidity
    //     }]
  	// });
    //
  	// chart.render();
    // }
      var ctx = document.getElementById('humidityGraph');
      var myChart = new Chart(ctx, {
          type: 'line',
          data: {
              datasets: [{
                  label: name+"-temp",
                  data: temperature,
                  fill: true,
                  borderColor: "#eb5136",
                  // fillColor: "#eb5136",
                  // background: "#eb5136",
                  backgroundColor: "rgba(235, 81, 54, 0.3)",
                  // pointBackgroundColor: "rgba(235, 81, 54, 0.3)",
              },{
                  label: name+"-humi",
                  data: humidity,
                  fill: true,
                  borderColor: "#36a2eb",
                  // fillColor: "#36a2eb",
                  // background: "#36a2eb",
                  backgroundColor: "rgba(54, 162, 235, 0.3)",
                  // pointBackgroundColor: "rgba(54, 162, 235, 0.3)",
              }],
              labels: labelList
          },
          options: {
            animation: {
                duration: 0
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        beginAtZero: true,
                    }
                }]
            },
            elements: {
                      point:{
                          radius: 0
                      }
                  }
          }
      });
    }
}
