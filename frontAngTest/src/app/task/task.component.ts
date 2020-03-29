import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  tasksTodo: any[] = null;
  tasksInprogres: any[] = null;
  tasksDone: any[] = null;

  constructor( private http: HttpClient ) { }

  ngOnInit() {
    this.getTodoTasks()
    this.getInprogresTasks()
    this.getDoneTasks()
  }

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

  getInprogresTasks(){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8000/task/Inprogres"
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        this.tasksInprogres=data;
      }
      else {
      console.log('Database is empty')
      }
    })
  }

  getDoneTasks(){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8000/task/done"
    this.http.get<any[]>(url).subscribe( data =>
    {
      if(data!=null){
        this.tasksDone=data;
      }
      else {
      console.log('Database is empty')
      }
    })
  }

  start(name){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8000/task/update"
    let object={}
    object["status"]="Inprogres"
    object["name"]=name
    this.http.post(url, object).subscribe( data =>
    {
      if(data!=null){
        this.getTodoTasks()
        this.getInprogresTasks()
      }
      else {
      console.log('Database is empty')
      }
    })
  }

  finish(name){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8000/task/update"
    let object={}
    object["status"]="done"
    object["name"]=name
    this.http.post(url, object).subscribe( data =>
    {
      if(data!=null){
        this.getInprogresTasks()
        this.getDoneTasks()
      }
      else {
      console.log('Database is empty')
      }
    })
  }

  todo(name){
    const host = (window.location.href.split("/")[2]).split(":")[0]
    let url = "http://" + host + ":8000/task/update"
    let object={}
    object["status"]="todo"
    object["name"]=name
    this.http.post(url, object).subscribe( data =>
    {
      if(data!=null){
        this.getInprogresTasks()
        this.getDoneTasks()
      }
      else {
      console.log('Database is empty')
      }
    })
  }

}
