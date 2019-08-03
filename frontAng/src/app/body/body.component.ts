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


  constructor(private http: HttpClient) { }

  ngOnInit()
  {
    this.getDevicesList()
  }

  getDevicesList(){
    //const host = (window.location.href.split("/")[2]).split(":")[0]
    const host = "88.8.65.164"
    let url = "http://" + host + ":8000/all"
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
    console.log(device.status)
    if(device.status){newStatus="false"}
    else if (!device.status){newStatus="true"}
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8000/update/" + device.name +"/"+ newStatus
    // console.log(url)
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

}
