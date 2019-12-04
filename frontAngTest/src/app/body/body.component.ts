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

  getDevicesList(){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    // const host = "88.8.65.164"
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

  changeStatus(device){
    let newStatus=null
    const host = (window.location.href.split("/")[2]).split(":")[0]
    if(device.status){
      let url = "http://" + host + ":8000/update/" + device.name +"/false/"
    }
    else if (!device.status){
      let url = "http://" + host + ":8000/update/" + device.name +"/true/"+ this.lapse_time*60000
    }
    let startTime = new Date().getTime()
    this.http.get(url).subscribe( data =>
    {
      if(data!=null){
        let finishTime = new Date().getTime()
        this.getDiference(startTime, finishTime)
        this.getDevicesList()
      }
      else {
      // console.log('no response')
      }
    })
  }

  getDiference(startTime, finishTime){
    let lapse = finishTime - startTime
    this.lapse = lapse
  }

  reload2() {
       setTimeout(function(){
         console.log("reload")
            this.getDevicesList()
            this.reload2()
       }, 1000)
  }

}
