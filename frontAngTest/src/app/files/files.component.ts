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
    let url = "https://www.file.cortijodemazas.com/list"
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

  download(file){
    let url = "https://www.file.cortijodemazas.com/download/" + file
    window.location.href = url
  }

  fileupload(file: FileList){
    event.preventDefault()
    let url = "https://www.file.cortijodemazas.com/fileupload"
    event.preventDefault()
    //const file = event.target.files
    console.log(file)
    var fd = new FormData();
    fd.append('file', file.item(0));
    this.http.post(url, fd).subscribe( data =>
    {
      if(data!=null){
        console.log(data)
        this.getFiles()
      }
    })
  }

}
