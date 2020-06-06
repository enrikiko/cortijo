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
function executeTimeoutGetSensors(){
    setTimeout(function(){
            executeTimeoutGetSensors()
            getSensor()
        }, parseInt(config.get("timeout_sensor")));
}
/*
executeTimeoutCheckDevices:
  checkDevices:
  chechSensors:
*/
function executeTimeoutCheckDevices(){
    setTimeout(function(){
            executeTimeoutCheckDevices()
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
    //logs.log("Checking devices: ")
    var devicesList = await myDevice.getDevice()
    //logs.log(devicesList)
    for (var index in devicesList){
        var name = devicesList[index].name
        //logs.log("Checking " + name )
        try{
            var status = await joker.getDeviceStatus(name)
            await myDevice.setCheckSensorByName(name, true)
            //logs.log(status.SSID)
            if (status.SSID && status.SIGNAL){
                //logs.log(status.SSID)
                //logs.log(status.SIGNAL)
                await wifi.newSignal(name,status.SSID,status.SIGNAL)
                statusMap[name] = {"SSID":status.SSID, "SIGNAL":status.SIGNAL}
                //console.log(statusMap)
                //logs.log(res)
                }
             else(statusMap[name] = 0)
        }catch(e){
            logs.error(e)
            await myDevice.setCheckSensorByName(name, false);
            if(statusMap[name] && statusMap[name].SSID){
                await wifi.newSignal(name,statusMap[name].SSID,-100)
                }

        }
    }
    //console.log(statusMap)
    socket.wifi("check(wifi)")
    socket.device("check(device)")
}

async function chechSensors() {
  //logs.log("Checking sensors: ")
  var sensorsList = await mySensor.getAllSensor()
  for (var index in sensorsList){
      var name = sensorsList[index].name
      //logs.log("Checking " + name )
      try{
        var status = await joker.getSensorStatus(name)
        if (status.SSID){
            //logs.log(status.SSID)
            //logs.log(status.SIGNAL)
            await wifi.newSignal(name,status.SSID,status.SIGNAL)
            statusMap[name] = {"SSID":status.SSID, "SIGNAL":status.SIGNAL}
            //console.log(statusMap)
            //logs.log(res)
            }
         else(statusMap[name] = 0)
      }catch(e){
          logs.error(e)
          //await myDevice.blockDeviceByName(name);
          if(statusMap[name] && statusMap[name].SSID){
                await wifi.newSignal(name,statusMap[name].SSID,-100)
                }
      }
    }
    //console.log(statusMap)
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
  var devices = await mySensor.getDevices(name)
  var lastValue = await mySensor.getLastValue(name)
  var increasing = await mySensor.isIncreasing(name)
  if (min!=undefined&max!=undefined&devices.length>0) {
    if ( increasing ){
      if ( data.humidity >= max ){
        //list[name+"_increase"]=false
        await mySensor.isIncreasing(name, false)
      }else {
        if ( lastValue >= data.humidity ) {
          if ( count >= parseInt(config.get("times_before_block")) ) {
            logs.error("----------------------------------Sensor is block!!!----------------------------------");
          }else {
            logs.error("---------------------------------------Alert!!!---------------------------------------");
            //list[name+"_count"]++
            await mySensor.setCount(name, count++)
            for (var i in devices) {
              mySwitch.changeStatusToTrue(devices[i] , lapse, null, "auto")
            }
          }
        }else {
          for (var i in devices) {
            mySwitch.changeStatusToTrue(devices[i] , lapse, null, "auto")
          }
        }
      }
    }else {
      if ( data.humidity <= min ){
        //list[name+"_increase"]=true
        await mySensor.isIncreasing(name, true)
        //list[name+"_last"]=data.humidity
        await mySensor.setLastValue(name, data.humidity)
        //list[name+"_count"]=0
        await mySensor.setCount(name, 0)
        for (var i in devices) {
          mySwitch.changeStatusToTrue(devices[i] , lapse, null, "auto")
        }
      }
    }
  }
}
//
executeTimeoutGetSensors()
executeTimeoutCheckDevices()
