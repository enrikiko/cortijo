import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './canvasjs.min';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { SocketService } from '../socket.service';

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
        var signalList = []
        var signal
        for(var index in data){
          // list.push(index+"-"+res[index])
          signal={ y: parseInt(data[index].signal)+100, label: new Date(parseInt(data[index].time)) }
          signalList.push(signal)
        }
        this.printGraphWifi(wifi, signalList)
      }
    })
  }

  printGraphWifi(name, data){
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
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
  }

}
