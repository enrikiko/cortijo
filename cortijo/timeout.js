const sensors = require('./sensors');
const myDevice = require('./devices');
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
        logs.log(sensorList[index].name)
    }
}
//
async function check(){
    logs.log("check...")
    var devicesList = await myDevice.getDevice()
    logs.log(devicesList)
    logs.log(typeof(devicesList))
    for (var index in devicesList){
        logs.log(devicesList[index].name)
        await myDevice.checkDeviceByName(devicesList[index].name)
    }
}
//
executeTimeoutSensor()
executeTimeoutCheck()
