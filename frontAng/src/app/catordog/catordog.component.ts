import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-catordog',
  templateUrl: './catordog.component.html',
  styleUrls: ['./catordog.component.css']
})
export class CatordogComponent implements OnInit {

  response: any = "null";

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }
  update(event){
    console.log(event);
    event.preventDefault();
    let reader = new FileReader();
    let formData = new FormData();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      formData.append('upload', file);
      console.log(file);
    };
    const url = "http://88.8.65.164:8200/upload"
    const options = {
      headers: new HttpHeaders().set('Authorization', "EnriqueRamos"),
    }
    this.http.post(url, formData, options).subscribe( data =>
    {
      if(data!=null){
        this.response=data;
        console.log(data);
      }
      else {
      console.log('Database is empty')
      this.response="No response";
      }
    })

  }

}
