import { Component, OnInit } from '@angular/core';
//import * as CanvasJS from './canvasjs.min';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { SocketService } from '../socket.service';
import Chart from 'chart.js';

@Component({
  selector: 'app-humidity',
  templateUrl: './sensorGraphic.component.html',
  styleUrls: ['./sensorGraphic.component.css']
})
export class SensorGraphicComponent implements OnInit {

logs:any[]=null;
sensorList:any[]=null;
showGraphic=true;
sensor:string=null;
type:any=null;
subscription:any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private socketService: SocketService ) { }

  ngOnInit() {
    this.sensor = this.router.url.split("/")[2]
    this.getSensorType(this.sensor)
    //this.getSensor()
    this.subscription = this.socketService.getDataAlert().subscribe( (msg)=>{
      if(this.sensor){
        this.getData(this.sensor, this.type,)
      }
    })
  }
  ngOnDestroy() {
    this.sensor=null
    this.subscription.unsubscribe()
  }

  getSensorType( sensorName ){
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
    })
    let url = "https://back.app.cortijodemazas.com/sensor/type/" + sensorName
    this.http.get(url, { headers: headers }).subscribe( data =>
    {
      if(data != null){
        //this.sensorList = data
        this.type = data
        this.getData(this.sensor, this.type)
      }
    })
  }

  // wraperGetData(sensor){
  //   this.sensor=sensor
  //   this.getData(sensor)
  // }

  getData(sensor, type){
    let url = "https://back.app.cortijodemazas.com/all/" + type + "/" + sensor
    switch(type) {
      case "humidity":
        this.getHumidity(url, name)
        // code block
        break;
      case "temperature":
      this.getTemperature(url, name)
        // code block
        break;
      default:
        console.log("switch default")
    }
    }

    getHumidity(url, name){
      const jwt = window.localStorage.getItem('jwt')
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': jwt
      })
      this.http.get<HttpResponse<object>>(url, { headers: headers }).subscribe( data =>
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
            labelList.push(""+label.getHours()+":"+label.getMinutes()+" "+label.getDate())
          }
          this.printGraphHumidity(name, dataList, labelList);
        }
        else {
          console.log("No logs")
        }
      })
    }

    getTemperature(url, name){
      const jwt = window.localStorage.getItem('jwt')
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': jwt
      })
      this.http.get<HttpResponse<object>>(url, { headers: headers }).subscribe( data =>
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
            labelList.push(""+label.getHours()+":"+label.getMinutes()+" "+label.getDate())
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
