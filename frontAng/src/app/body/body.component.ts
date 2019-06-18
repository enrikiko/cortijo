import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  devices: any[] = null;



  constructor(private http: HttpClient) { }

  ngOnInit()
  {
    this.getDevicesList()
  }

  getDevicesList(){
    let url = "http://localhost:8000/all"
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        for(let index in data){
          console.log(data[index])
        }
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
    let url = "http://localhost:8000/update/" + device.name +"/"+ newStatus
    console.log(url)
    this.http.get(url).subscribe( data =>
    {
      if(data!=null){
        console.log(data)
        console.log('response')
      }
      else {
      console.log('no response')
      }
    })
    this.getDevicesList()
  }

}
