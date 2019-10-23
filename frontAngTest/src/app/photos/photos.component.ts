import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {

  dates: any[]=null;
  folders: any[]=null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getDates()
  }
  getdate(date){
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
