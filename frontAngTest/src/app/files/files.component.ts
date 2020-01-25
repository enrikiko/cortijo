import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

  files: any[] = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getFiles()
  }

  getFiles(){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8500/list"
    this.http.get<any>(url).subscribe( data =>
    {
      if(data!=null){
        this.files=data;
      }
      else {
      console.log('Database is empty')
      }
    })
  }

}
