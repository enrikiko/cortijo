const mySensor = require('./sensors');
const myDevice = require('./devices');
const joker = require('./joker');
const wifi = require('./wifi')
const logs = require('./logs');
const myTemperature = require('./temperature');
const myHumidity = require('./humidity');
const request = require('superagent');
const req = require('request');
const mySwitch = require('./switch');
const config = require('./config');
const socket = require('./socket');
//
function executeTimeoutGetSensors(){
    setTimeout(function(){
            executeTimeoutGetSensors()
            logs.log("Time out sensor executing every " + parseInt(config.get("timeout_sensor")) + " milliseconds")
            getSensor()
        }, parseInt(config.get("timeout_sensor")));
}
function executeTimeoutCheckDevices(){
    setTimeout(function(){
            executeTimeoutCheckDevices()
            logs.log("Time out check executing every " + parseInt(config.get("timeout_check")) + " milliseconds")
            checkDevices()
            chechSensors()
        }, parseInt(config.get("timeout_check")));
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
            safeData(dataType,dataName,dataContent)
            analiceData(dataType,dataName,dataContent)
        }catch(e){
            logs.error(e)
        }
    }
    socket.data("getSensor(data)")
}
//
statusMap={}
async function checkDevices(){
    logs.log("Checking devices: ")
    var devicesList = await myDevice.getDevice()
    //logs.log(devicesList)
    for (var index in devicesList){
        var name = devicesList[index].name
        logs.log("Checking " + name )
        try{
            var status = await joker.getDeviceStatus(name)
            await myDevice.checkDeviceByName(name)
            //logs.log(status.SSID)
            if (status.SSID && status.SIGNAL){
                //logs.log(status.SSID)
                //logs.log(status.SIGNAL)
                await wifi.newSignal(name,status.SSID,status.SIGNAL)
                statusMap[name] = {"SSID":status.SSID, "SIGNAL":status.SIGNAL}
                console.log(statusMap)
                //logs.log(res)
                }
             else(statusMap[name] = 0)
        }catch(e){
            logs.error(e)
            await myDevice.blockDeviceByName(name);
            if(statusMap[name] && statusMap[name].SSID){
                await wifi.newSignal(name,statusMap[name].SSID,0)
                }

        }
    }
    console.log(statusMap)
    socket.wifi("check(wifi)")
    socket.device("check(device)")
}

async function chechSensors() {
  logs.log("Checking sensors: ")
  var sensorsList = await mySensor.getAllSensor()
  for (var index in sensorsList){
      var name = sensorsList[index].name
      logs.log("Checking " + name )
      try{
        var status = await joker.getSensorStatus(name)
        if (status.SSID){
            //logs.log(status.SSID)
            //logs.log(status.SIGNAL)
            await wifi.newSignal(name,status.SSID,status.SIGNAL)
            statusMap[name] = {"SSID":status.SSID, "SIGNAL":status.SIGNAL}
            console.log(statusMap)
            //logs.log(res)
            }
         else(statusMap[name] = 0)
      }catch(e){
          logs.error(e)
          //await myDevice.blockDeviceByName(name);
          if(statusMap[name] && statusMap[name].SSID){
                await wifi.newSignal(name,statusMap[name].SSID,0)
                }
      }
    }
    console.log(statusMap)
    socket.wifi("check(wifi)")
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
              if (list[name+"count"] >= parseInt(config.get("times_before_block")) ) {
                logs.error("----------------------------------Sensor is block!!!----------------------------------");
              }else {
                logs.error("----------------------------------Alert!!!----------------------------------");
                list[name+"count"]++
                for (var i in devices) {
                  mySwitch.changeStatusToTrue(devices[i] , 1000, null, "timeout")
                }
              }
            }else {
              for (var i in devices) {
                mySwitch.changeStatusToTrue(devices[i] , 1000, null, "timeout")
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
              mySwitch.changeStatusToTrue(devices[i] , 1000, null, "timeout")
            }
          }
        }
      }
    break;
    }
}
//
executeTimeoutGetSensors()
executeTimeoutCheckDevices()
