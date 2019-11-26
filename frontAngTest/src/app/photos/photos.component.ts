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
  camera=null;
  date=null;
  url=null;
  certain=false;
  dataMap=null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getcamera()
  }

  getphoto(photo){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8400/camera/" + this.camera + "/" + this.date + "/" + photo
    this.url=url;
  }

  getdate(date){
    this.date=date
    this.certain=true
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8400/camera/" + this.camera + "/" + date
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        console.log("Data" + data)
        this.folders=this.formatList(data);
      }
    })
  }

  formatList(list){
    let finalList = []
    for(let elem in list){
      this.dataMap[this.formatDate(list[elem])] = elem
      finalList.push(this.formatDate(list[elem]))
    }
    console.log(this.dataMap)
    return finalList
  }

  formatDate(data){
    let finalData
    finalData = data.split(".")[0]
    finalData = finalData.split("A")[1]
    finalData = finalData.split("")
    finalData = finalData[6]+finalData[7]+":"+finalData[8]+finalData[9]+":"+finalData[10]+finalData[11]+" "+finalData[4]+finalData[5]+"/"+finalData[2]+finalData[3]+"/20"+finalData[0]+finalData[1]
    return finalData
  }


  getdates(camera){
    this.camera = camera
    this.folders = null
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8400/camera/" + this.camera
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
  this.folders = null
  this.dates = null
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
