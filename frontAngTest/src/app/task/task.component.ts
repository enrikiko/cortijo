import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  tasksTodo: any[] = null;

  constructor( private http: HttpClient ) { }

  ngOnInit() { this.getTodoTasks() }

  getTodoTasks(){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8000/task/todo"
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        this.tasksTodo=data;
      }
      else {
      console.log('Database is empty')
      }
    })
  }

}
