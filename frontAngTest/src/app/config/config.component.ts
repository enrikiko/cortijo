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
    const target = event.target
    console.log(target);
    const log = target.querySelector('#elem.key').value
    console.log(log);

  }

}
