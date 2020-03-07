import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

    config: any[] = null;
    LOG: string = "log";

    constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getConfig()
  }

  getConfig(){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    const url = "http://" + host + ":8000/config/"
    this.http.get(url).subscribe( data =>
    {
      if(data!=null){
        var list = []
        Object.keys(data).forEach(function(elem){
          var object={"key":null,"value":null}
          object.key=elem
          object.value=data[elem]
          list.push(object)
        })
        console.log(list)
        this.config = list

      }
      else {
       console.log('no response')
      }
    })
  }

  change(event){
    event.preventDefault()
    //console.log(this.config);
    var configObject = {}
    this.config.forEach(element => {
      configObject[element.key] = element.value
    })
    console.log(configObject);
    const host = (window.location.href.split("/")[2]).split(":")[0]
    const url = "http://" + host + ":8000/config/update"
    // const headers = new HttpHeaders.set('Content-Type', 'application/json');
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    this.http.get(url, configObject, {headers: headers}).subscribe( data =>
    {
      if(data!=null){
        console.log(data)
      }
      else {
       console.log('no response')
      }
    })
  }
}
