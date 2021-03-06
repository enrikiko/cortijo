import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import {AppConfiguration} from '../set_configuration/app-configuration';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  active:      String  = "normal"
  status:      Boolean = false;
  version:     any  = null;
  startTime:   any  = null;

  constructor(
              private auth: AuthService,
              private http: HttpClient,
              private appConfig: AppConfiguration ) { }

  ngOnInit() {
    this.auth.statusEventEmitter().subscribe(status => this.changeLoginResult(status));
    this.auth.statusEventEmitter().subscribe(status => this.changeLoginResult(status));
    this.getInfo()
  }

  changeLoginResult(status){this.status=status}
  normal(){this.active="normal"}
  off(){this.active="off"}
  alarm(){this.active="alarm"}

  getInfo(){
    const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/info"
    this.http.get<any>(url).subscribe( data =>
    {
      if(data!=null){
        this.version = data.Version
        this.startTime = data.StartTime
      }
    })
  }

}
