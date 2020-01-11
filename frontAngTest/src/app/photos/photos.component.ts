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
  data: any[]=null;
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

  getPhotos(){}

  getDatesYear(key){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8400/camera/" + key
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        this.data=data
        this.years=this.formatYearList(data)
      }
    })
  }

  formatYearList(key){
    let yearList=[]
    key.forEach(function(element){
      let yearNumber = element.split("")
      let year = yearNumber[0] + yearNumber[1] + yearNumber[2] + yearNumber[3]
      if( yearList.indexOf(year) === -1 ){
        yearList.push(year)}
      })
    return yearList
    }

  getDatesMonth(key){
    let monthList=[]
    this.data.forEach(function(element){
      if(element.includes(key)){
        let monthNumber = element.split("")
        let month = monthNumber[4] + monthNumber[5]
        if( monthList.indexOf(month) === -1 ){
          monthList.push(month)
        }
      }
    })
    this.months = monthList
  }

   getDatesDay(key){
     let dayList=[]
      this.data.forEach(function(element){
        if(element.includes(key)){
          let dayNumber = element.split("")
          let day = monthNumber[6] + monthNumber[7]
          if( dayList.indexOf(day) === -1 ){
            dayList.push(day)
          }
        }
      })
      this.days = dayList
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
