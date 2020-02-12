const mySensor = require('./sensors');
const myDevice = require('./devices');
const joker = require('./joker');
const logs = require('./logs');
const myTemperature = require('./temperature');
const myHumidity = require('./humidity');
const request = require('superagent');
const req = require('request');
const mySwitch = require('./switch');
const config = require('./config');
//
const TIMEOUT_SENSOR = config.get("timeout_sensor");
const TIMEOUT_CHECK = config.get("timeout_check");
const TIMES_BEFORE_BLOCK = config.get("times_before_block");
//
function executeTimeoutCheckSensors(){
    setTimeout(function(){
            executeTimeoutCheckSensors()
            logs.log("Time out sensor executing every " + TIMEOUT_SENSOR + " milliseconds")
            getSensor()
        }, TIMEOUT_SENSOR);
}
function executeTimeoutCheckDevices(){
    setTimeout(function(){
            executeTimeoutCheckDevices()
            logs.log("Time out check executing every " + TIMEOUT_CHECK + " milliseconds")
            check()
        }, TIMEOUT_CHECK);
}
//
async function getSensor(){
    logs.log("checking sensors: ")
    var sensorList = await mySensor.getAllSensor()//Get all sensor from db
    //logs.log(sensorList)
    for (var index in sensorList){
        var name = sensorList[index].name
        try{
            data = await mySensor.getData(name)
            dataName = name
            dataType = data.type
            dataContent = data.content
            //console.log(dataType,dataName,dataContent)
            safeData(dataType,dataName,dataContent)
            analiceData(dataType,dataName,dataContent)
        }catch(e){
            logs.log(e)
        }

    }
}
//
async function check(){
    logs.log("Checking devices: ")
    var devicesList = await myDevice.getDevice()
    //logs.log(devicesList)
    for (var index in devicesList){
        var name = devicesList[index].name
        logs.log("Checking " + name )
        try{
            var status = await joker.getDeviceStatus(name)
            await myDevice.checkDeviceByName(name)
        }catch(e){
            logs.log(e)
            await myDevice.blockDeviceByName(name);
        }
    }
}
//
function safeData(type,name,data){
    switch(type){
    case "Temperature":
    //logs.log("Name: " + name + " Type: " + type + " Content: " + data.humidity + " : " + data.temperature)
    myTemperature.newTemperature(name, data.temperature, data.humidity)
    break;
    case "Humidity":
    //logs.log("Name: " + name + " Type: " + type + " Content: " + data.humidity)
    myHumidity.newHumidity(name, data.humidity)
    break;
    }
}
var list = {}
async function analiceData(type,name,data) {
    switch(type){
    case "Temperature":
    //TODO logic for temperature
      logs.log("Name: " + name + " Type: " + type + " Humidity: " + data.humidity + " Temperature: " + data.temperature)
    break;
    case "Humidity":
      var min = await mySensor.getMin(name)
      var max = await mySensor.getMax(name)
      var devices = await mySensor.getDevices(name)
      if (min!=undefined&max!=undefined&devices.length>0) {
        logs.log("Name: " + name + " Type: " + type + " Content: " + data.humidity + " Min:" + min + " Max: " + max + " Devices " + devices + " Data: " + data.humidity)
        if ( list[name+"increase"] ) {
          if ( data.humidity <= max ){
            if ( list[name+"last"] >= data.humidity ) {
              if (list[name+"count"] >= TIMES_BEFORE_BLOCK ) {
                console.log("----------------------------------Sensor is block!!!----------------------------------");
              }else {
                console.log("----------------------------------Alert!!!----------------------------------");
                list[name+"count"]++
                for (var i in devices) {
                  mySwitch.changeStatus(devices[i] , 1000)
                }
              }
            }else {
              for (var i in devices) {
                mySwitch.changeStatus(devices[i] , 1000)
              }
            }
          }else {
            list[name+"increase"]=false
          }
        }else {
          if ( data.humidity <= min ){
            list[name+"increase"]=true
            list[name+"last"]=data.humidity
            list[name+"count"]=0
            for (var i in devices) {
              mySwitch.changeStatus(devices[i] , 1000)
            }
          }
        }
      }
    break;
    }
}
//
executeTimeoutCheckSensors()
executeTimeoutCheckDevices()
