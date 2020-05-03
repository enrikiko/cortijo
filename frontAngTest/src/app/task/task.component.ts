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
  task: any = {name: null, description: null};

  constructor( private http: HttpClient ) { }

  ngOnInit() {
    this.getTodoTasks()
    this.getInprogresTasks()
    this.getDoneTasks()
  }

  createTask(event) {
    let url = "http://back.app.cortijodemazas.com/task"
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    var object = {};
    object["name"]=this.task.name;
    object["description"]=this.description.name;
    this.http.post<any>(url, object, {headers: headers}).subscribe( data =>
    {
      if(data){
        console.log(data)
        this.getTodoTasks()
      }
      else {
        console.log('no data')
      }
    })
  }

  getTodoTasks(){
    let url = "http://back.app.cortijodemazas.com/task/todo"
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
    let url = "http://back.app.cortijodemazas.com/task/Inprogres"
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
    let url = "http://back.app.cortijodemazas.com/task/done"
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
    let url = "http://back.app.cortijodemazas.com/task/update"
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
    let url = "http://back.app.cortijodemazas.com/task/update"
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
    let url = "http://back.app.cortijodemazas.com/task/update"
    let object={}
    object["status"]="todo"
    object["name"]=name
    this.http.post(url, object).subscribe( data =>
    {
      if(data!=null){
        this.getTodoTasks()
        this.getDoneTasks()
      }
      else {
      console.log('Database is empty')
      }
    })
  }

}
