const mySensor = require('./sensors');
const myDevice = require('./devices');
const joker = require('./joker');
const logs = require('./logs');
const myTemperature = require('./temperature');
const myHumidity = require('./humidity');
const request = require('superagent');
const req = require('request');
const config = require('./config');
//
const TIMEOUT_SENSOR = config.get("timeout_sensor");
const TIMEOUT_CHECK = config.get("timeout_check");
//
function executeTimeoutSensor(){
    setTimeout(function(){
            executeTimeoutSensor()
            logs.log("Time out sensor executing every " + TIMEOUT_SENSOR + " milliseconds")
            getSensor()
        }, TIMEOUT_SENSOR);
}
function executeTimeoutCheck(){
    setTimeout(function(){
            executeTimeoutCheck()
            logs.log("Time out check executing every " + TIMEOUT_CHECK + " milliseconds")
            check()
        }, TIMEOUT_CHECK);
}
//
async function getSensor(){
    logs.log("getSensor...")
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
    logs.log("check...")
    var devicesList = await myDevice.getDevice()
    for (var index in devicesList){
        var name = devicesList[index].name
        logs.log("Checking " + name + "...")
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
    logs.log("Name: " + name + " Type: " + type + " Content: " + data.humidity + " : " + data.temperature)
    myTemperature.newTemperature(name, data.temperature, data.humidity)
    break;
    case "Humidity":
    logs.log("Name: " + name + " Type: " + type + " Content: " + data.humidity)
    myHumidity.newHumidity(name, data.humidity)
    break;
    }
}
async function analiceData(type,name,data) {
    switch(type){
    case "Temperature":
    //TODO logic for temperature
    console.log("analiceData to be done");
    break;
    case "Humidity":
    var min = await mySensor.getMin(name)
    var max = await mySensor.getMax(name)
    var devices = await mySensor.getDevices(name)
    if (min&max&devices) {
      logs.log("Name: " + name + " Type: " + type + " Content: " + data.humidity + " Min:" + min + " Max: " + max + " Devices " + devices)
    }
    else{
      console.log("No applicable to " + name);
    }
    break;
    }
}
//
executeTimeoutSensor()
executeTimeoutCheck()
