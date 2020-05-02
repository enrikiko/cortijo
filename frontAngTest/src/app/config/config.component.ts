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
    check: boolean = false;

    constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getConfig()
  }

  getConfig(){
    const url = "http://back.app.cortijodemazas.com/config/"
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
    this.check=false
    event.preventDefault()
    //console.log(this.config);
    var configObject = {}
    this.config.forEach(element => {
      configObject[element.key] = element.value
    })
    const url = "http://back.app.cortijodemazas.com/config/update"
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    this.http.post(url, configObject, {headers: headers}).subscribe( data =>
    {
      if(data!=null){
        this.check=true
      }
      else {
       console.log('no response')
      }
    })
  }
}
