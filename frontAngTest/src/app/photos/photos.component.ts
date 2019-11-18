import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {

  cameras: any[]=null;
  dates: any[]=null;
  folders: any[]=null;
  date=null;
  url=null;
  certain=false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getcamera()
  }

  getphoto(photo){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8400/camera/" + this.date + "/" + photo
    this.url=url;
  }

  getdate(date){
    this.date=date
    this.certain=true
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8400/camera/" + date
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        console.log("Data" + data)
        this.folders=data;
      }
    })
  }

  getdates(camera){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8400/camera/" + camera
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        console.log("Dates" + data)
        this.dates=data;
      }
      else {
      console.log('No dates')
      }
    })
  }

  getcamera(){
  const host = (window.location.href.split("/")[2]).split(":")[0]
  let url = "http://" + host + ":8400/camera"
  this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        console.log("cameras" + data)
        this.cameras=data;
      }
      else {
      console.log('No dates')
      }
    })
  }

}
