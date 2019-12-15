const sensors = require('./sensors');
const myDevice = require('./devices');
const joker = require('./joker');
const logs = require('./logs');
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
    var sensorList = await sensors.getAllSensor()
    logs.log(sensorList)
    for (var index in sensorList){
        var name = sensorList[index].name
        logs.log(name)
        try{
            data = await sensors.getData(name)
            logs.log(data.name)
            logs.log(data.type)
            logs.log(data.content)
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
executeTimeoutSensor()
executeTimeoutCheck()
