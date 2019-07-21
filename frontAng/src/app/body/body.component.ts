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
    const host = (window.location.href.split("/")[2]).split(":")[0]
    console.log(host)
    this.http.get("https://5nwdav0wk9.execute-api.eu-central-1.amazonaws.com/dev/get_ip").subscribe( data =>
    {
      if(data!=null){
        console.log(data)
      }
      else { console.log("No data")
      }
    })
    // const host = "88.8.71.214"
    let url = "http://" + host + ":8000/all"
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        // for(let index in data){
        //   console.log(data[index])
        // }
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
    this.http.get(url).subscribe( data =>
    {
      if(data!=null){
        // console.log(data)
        this.getDevicesList()
      }
      else {
      // console.log('no response')
      }
    })

  }

}
