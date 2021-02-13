import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import {AppConfiguration} from '../set_configuration/app-configuration';

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

  constructor( private http: HttpClient,
               private appConfig: AppConfiguration) { }


  ngOnInit() {
    this.getTodoTasks()
    this.getInprogresTasks()
    this.getDoneTasks()
  }

  createTask() {
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': jwt
    })
    const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/task"
    // let headers = new HttpHeaders();
    // headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    var object = {};
    object["name"] = this.task.name;
    object["description"] = this.task.description;
    this.http.post<any>(url, {headers: headers}, object).subscribe( data =>
    {
      if(data){
        console.log(data)
        this.getTodoTasks()
        this.task.name=null
        this.task.description=null
      }
      else {
        console.log('no data')
        this.getTodoTasks()
        this.task.name=this.task.name+1
      }
    })
  }

  getTodoTasks(){
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
    })
    const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/task/todo"
    this.http.get<any[]>(url, { headers: headers }).subscribe( data =>
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
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
    })
    const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/task/Inprogres"
    this.http.get<any[]>(url, { headers: headers }).subscribe( data =>
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
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
    })
    const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/task/done"
    this.http.get<any[]>(url, { headers: headers }).subscribe( data =>
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
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
    })
    const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/task/update"
    let object={}
    object["status"]="Inprogres"
    object["name"]=name
    this.http.post(url, { headers: headers }, object).subscribe( data =>
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
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
    })
    const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/task/update"
    let object={}
    object["status"]="done"
    object["name"]=name
    this.http.post(url, { headers: headers }, object).subscribe( data =>
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
    const jwt = window.localStorage.getItem('jwt')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': jwt
    })
    const url = this.appConfig.protocol + "://" + this.appConfig.back_url + "/task/update"
    let object={}
    object["status"]="todo"
    object["name"]=name
    this.http.post(url, { headers: headers }, object).subscribe( data =>
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
