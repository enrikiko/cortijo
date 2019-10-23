import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {

  dates: any[]=null;
  date=null;
  folders: any[]=null;
  url=null;
  certain=false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getDates()
  }

  getphoto(photo){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8400/" + this.date + "/" + photo
    this.url=url;
  }

  getdate(date){
    this.date=date
    this.certain=true
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8400/" + date
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        console.log(data)
        this.folders=data;
      }
    })
  }

  getDates(){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8400"
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        console.log(data)
        this.dates=data;
      }
      else {
      console.log('No dates')
      }
    })
  }

}
