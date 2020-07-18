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
var list = {}
var statusMap = {}
/*
executeTimeoutGetSensors:
  getSensor:
  - Get all sensor from db
  - Loop over all sensors
  - safeData: Save data from sensor
  - analiceData: Analice data from sensor
*/
function executeTimeoutGetSensorsData(){
    setTimeout(function(){
            executeTimeoutGetSensorsData()
            getSensor()
        }, parseInt(config.get("timeout_sensor")));
}
/*
executeTimeoutCheckDevices:
  checkDevices:
  chechSensors:
*/
function executeTimeoutCheck(){
    setTimeout(function(){
            executeTimeoutCheck()
            console.log("Test");
            console.log(statusMap);
            checkDevices()
            chechSensors()
        }, parseInt(config.get("timeout_check")));
}
//
async function getSensor(){
    var sensorList = await mySensor.getAllSensor()  //Get all sensor from db
    for(var index in sensorList){  //Loop over all sensors
        var name = sensorList[index].name
        try{
            data = await mySensor.getData(name)
            dataType = data.type
            dataContent = data.content
            safeData(dataType, name, dataContent)
            analiceData(dataType, name, dataContent)
        }catch(e){
            logs.error(e)
        }
    }
    socket.data("getSensor(data)")
}
//
async function checkDevices(){
    var devicesList = await myDevice.getDevice()
    for (var index in devicesList){
        var name = devicesList[index].name
        try{
            var status = await joker.getDeviceStatus(name)
            await myDevice.setCheckDeviceByName(name, true)
            if (status.SSID && status.SIGNAL){
                await wifi.newSignal(name,status.SSID,status.SIGNAL)
                statusMap[name] = {"SSID":status.SSID, "SIGNAL":status.SIGNAL}
                }
             else(statusMap[name] = 0)
        }catch(e){
            logs.error(e)
            await myDevice.setCheckDeviceByName(name, false);
            if(statusMap[name] && statusMap[name].SSID){
                await wifi.newSignal(name,statusMap[name].SSID,-100)
                }

        }
    }
    socket.wifi("check(wifi)")
    socket.device("check(device)")
}

async function chechSensors() {
  var sensorsList = await mySensor.getAllSensor()
  for (var index in sensorsList){
      var name = sensorsList[index].name
      try{
        var status = await joker.getSensorStatus(name)
        if (status.SSID){
            await wifi.newSignal(name,status.SSID,status.SIGNAL)
            statusMap[name] = {"SSID":status.SSID, "SIGNAL":status.SIGNAL}
            }
         else(statusMap[name] = 0)
      }catch(e){
          logs.error(e)
          if(statusMap[name] && statusMap[name].SSID){
                await wifi.newSignal(name,statusMap[name].SSID,-100)
                }
      }
    }
    socket.wifi("check(wifi)")
}
//
function safeData(type,name,data){
    switch(type){
    case "Temperature":
    myTemperature.newTemperature(name, data.temperature, data.humidity)
    break;
    case "Humidity":
    myHumidity.newHumidity(name, data.humidity)
    break;
    }
}
async function analiceData(type,name,data) {
    switch(type){
    case "Temperature":
    await analiceTemperature(type, name, data)
    break;
    case "Humidity":
    await analiceHumidity(type, name, data)
    break;
    }
}
async function analiceTemperature(type, name, data) {/*TODO*/}
async function analiceHumidity(type, name, data) {
  var min = await mySensor.getMin(name)
  var max = await mySensor.getMax(name)
  var lapse = await mySensor.getLapse(name)
  var count = await mySensor.getCount(name)
  var block = await mySensor.isBlocked(name)
  var devices = await mySensor.getDevices(name)
  var increasing = await mySensor.increasing(name)
  var lastValue = await mySensor.getLastValue(name)
  if (min!=undefined & max!=undefined & devices.length>0 & !block) {
    if ( increasing ){
      if ( data.humidity >= max ){
        await mySensor.setIncreasing(name, false)
        await mySwitch.changeStatusToFalse(devices[i], null, "node.js")
      }else {
        if ( lastValue >= data.humidity ) {
          if ( count >= parseInt(config.get("times_before_block")) ) {
            await mySensor.blocked(name, true)
            logs.error("----------------------------------"+name+" is block!!!----------------------------------");
          }else {
            logs.error("-----------------------Alert, "+name+" is not changing the value!!!--------------------------------");
            await mySensor.setCount(name, count++)
            for (var i in devices) {
              mySwitch.changeStatusToTrue(devices[i] , lapse, null, "node.js")
            }
          }
        }else {
          for (var i in devices) {
            mySwitch.changeStatusToTrue(devices[i] , lapse, null, "node.js")
          }
        }
      }
    }else {
      if ( data.humidity <= min ){
        await mySensor.setIncreasing(name, true)
        await mySensor.setLastValue(name, data.humidity)
        await mySensor.setCount(name, 0)
        for (var i in devices) {
          mySwitch.changeStatusToTrue(devices[i] , lapse, null, "node.js")
        }
      }
    }
  }
}
//
executeTimeoutGetSensorsData()
executeTimeoutCheck()
