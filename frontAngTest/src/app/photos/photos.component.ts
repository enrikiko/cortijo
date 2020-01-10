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
  years: any[]=null;
  months: any[]=null;
  days: any[]=null;
  folders: any[]=null;
  camera=null;
  date=null;
  url=null;
  certain=false;
  dataMap={};
  dataCameraMap={};

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getCamera()
  }

  getCamera(){
    this.folders = null
    this.dates = null
    this.years = null
    this.months = null
    this.days = null
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8400/camera"
    this.http.get<any[]>(url).subscribe( data =>
      {
        if(data!=null){
          this.cameras=data;
        }
        else {
          console.log('No dates') //TODO alert there is a problem
        }
      })
  }

  getDatesMonth(){}

  getDatesDay(){}

  getPhotos(){}

  getPhoto(){}

  getDatesYear(key){
    this.date = this.dataCameraMap[key]
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8400/camera/" + this.camera + "/" + date
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        this.folders=this.formatList(data);
        this.years=this.formatYearList(this.folders)
      }
    })
  }

  formatList(list){
    let finalList = []
    for(let index in list){
      let key = this.formatDate(list[index])
      this.dataMap[key] = list[index]
      finalList.push(key)
    }
    return finalList
  }

  formatDate(data){
    let finalData
    finalData = data.split(".")[0]
    finalData = finalData.split("A")[1]
    finalData = finalData.split("")
    finalData = finalData[6]+finalData[7]+":"+finalData[8]+finalData[9]+":"+finalData[10]+finalData[11]
    return finalData
  }

  formatCameraDate(data){
    let finalData
    finalData = data.split("")
    finalData = finalData[6]+finalData[7]+"/"+finalData[4]+finalData[5]+"/"+finalData[0]+finalData[1]+finalData[2]+finalData[3]
    return finalData
  }

   formatYearList(key){
    key=["15/12/2019","15/12/2019","15/12/2020"]
    yearList=[]
    key.forEach(function(element){
      year=element.split("/")[2]
      if( yearList.indexOf(year) === -1 ){
        yearList.push(year)}
      })
    this.years = yearList
    }



  getdate(key){
    const date = this.dataCameraMap[key]
    this.date = date
    this.certain=true
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8400/camera/" + this.camera + "/" + date
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        this.folders=this.formatList(data);
      }
    })
  }

  getPhoto(key){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    const photo = this.dataMap[key]
    let url = "http://" + host + ":8400/camera/" + this.camera + "/" + this.date + "/" + photo
    this.url=url;
  }

  getDates(camera){
    this.camera = camera
    this.folders = null
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8400/camera/" + this.camera
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        this.dates=this.formatCameraList(data);
      }
      else {
      console.log('No dates')
      }
    })
  }

  formatCameraList(list){
    let finalList = []
    for(let index in list){
      let key = this.formatCameraDate(list[index])
      this.dataCameraMap[key] = list[index]
      finalList.push(key)
    }
    return finalList
  }

}
