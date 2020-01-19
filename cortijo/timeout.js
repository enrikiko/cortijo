const mySensor = require('./sensors');
const myDevice = require('./devices');
const joker = require('./joker');
const logs = require('./logs');
const myTemperature = require('./temperature');
const myHumidity = require('./humidity');
const request = require('superagent');
const req = require('request');
const fs = require('fs');
const yaml = require('js-yaml')
// Get config
const config_file = fs.readFileSync('config.yaml');
const config = yaml.safeLoad(config_file);
const TIMEOUT_SENSOR = config.timeout_sensor
const TIMEOUT_CHECK = config.timeout_check
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
    var sensorList = await mySensor.getAllSensor()
    //logs.log(sensorList)
    for (var index in sensorList){
        var name = sensorList[index].name
        try{
            data = await mySensor.getData(name)
            dataName = name
            dataType = data.type
            dataContent = data.content
            console.log(dataType,dataName,dataContent)
            safeData(dataType,dataName,dataContent)
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
    case "temperature":
    logs.log("case temperature")
    logs.log("Name: " + name + " Type: " + type + " Content: " + data.humidity + " : " + data.temperature)
    myTemperature.newTemperature(name, data.temperature, data.humidity)
    break;
    case "humidity":
    logs.log("case humidity")
    logs.log("Name: " + name + " Type: " + type + " Content: " + data.humidity)
    myHumidity.newHumidity(name, data.humidity)
    break;
    }
}
//
executeTimeoutSensor()
executeTimeoutCheck()
