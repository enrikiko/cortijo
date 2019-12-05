import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  devices: any[] = null;
  lapse: number = null;
  lapse_time: number = 5;


  constructor(private http: HttpClient) { }

  ngOnInit()
  {
    this.getDevicesList()
    this.reload2()
  }

  changeStatus(device){
    let newStatus=null
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = null
    if(device.status){
      url = "http://" + host + ":8000/update/" + device.name +"/false/"
    }
    else if (!device.status){
      url = "http://" + host + ":8000/update/" + device.name +"/true/"+ this.lapse_time*60000
    }
    let startTime = new Date().getTime()
    this.http.get(url).subscribe( data =>
    {
      if(data!=null){
        let finishTime = new Date().getTime()
        this.getDifference(startTime, finishTime)
        this.getDevicesList()
      }
      else {
      // console.log('no response')
      }
    })
  }

  getDifference(startTime, finishTime){
    let lapse = finishTime - startTime
    this.lapse = lapse
  }

  reload2() {
    console.log("reload")
    setTimeout(function(){
      console.log("setTimeout")
      this.reload2()
    },3000);
    //while(true){this.getDevicesList()}
//     setTimeout(function(){
//
//       })
//     }, 1000)
  }

    getDevicesList(){
    console.log("getDevicesList")
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8000/all/device"
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        this.devices=data;
      }
      else {
      console.log('Database is empty')
      }
    })
  }

}
