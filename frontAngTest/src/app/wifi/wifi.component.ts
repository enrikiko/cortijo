import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './canvasjs.min';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { SocketService } from '../socket.service';
import Chart from 'chart.js';

@Component({
  selector: 'app-wifi',
  templateUrl: './wifi.component.html',
  styleUrls: ['./wifi.component.css']
})
export class WifiComponent implements OnInit {

 wifis:any[]=["test_wifi","Cuarto2.4G","WifiSalon"];
 wifi:string=null;
 subscription:any;
 //wifiData: any[]=null;

  constructor( private http: HttpClient, private socketService: SocketService ) { }

  ngOnInit() {
    this.getWifis()
    this.subscription = this.socketService.getWifiAlert().subscribe( (msg)=>{
      if(this.wifi){
        this.getData(this.wifi)
      }
    })
  }
  ngOnDestroy() {
    this.wifi=null
    this.subscription.unsubscribe()
  }
  wrapGetData(wifi){
    this.wifi = wifi
    this.getData(wifi)
  }
  getWifis(){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8000/wifis"
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        console.log(this.wifis)
        this.wifis = data
        console.log(this.wifis)
      }
    })
  }
  getData(wifi){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8000/wifi/" + wifi
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        var dataList = []
        var labelList = []
        var wifiData
        var label
        for(var index in data){
          // list.push(index+"-"+res[index])
          wifiData = parseInt(data[index].signal)+100
          dataList.push(wifiData)
          label = new Date(parseInt(data[index].time))
          labelList.push(label.getDate())
        }
        this.printGraphWifi(wifi, dataList, labelList)
      }
    })
  }

  printGraphWifi(name, dataList, labelList){
  //   let chart = new CanvasJS.Chart("wifiGraph", {
  //   animationEnabled: false,
  //   exportEnabled: false,
  //   title: { text: name },
  //   data: [{
  //     type: "spline",
  //              color: "rgba(255,0,0,1)", //red
  //     dataPoints: data
  //   }]
  // });
  //   chart.render();
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: name,
                data: dataList,
                fill: false,
                //backgroundColor: "#36a2eb",
                //pointBorderColor: "#55bae7",
                borderColor: "#36a2eb",
                //pointHoverBackgroundColor: "#55bae7",
                //pointHoverBorderColor: "#55bae7",
            }],
            labels: labelList
        },
        options: {
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
    //console.log(dataList);

  }

}
