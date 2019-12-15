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
    for (var sensor in sensorList){
        logs.log(sensor.name)
    }
}
//
async function check(){
    logs.log("check...")
    var devicesList = await myDevice.getDevice()
    logs.log(devicesList)
    for (var device in devicesList){
        logs.log(device.name)
        //await myDevice.checkDeviceByName(device.name)
    }
}
//
executeTimeoutSensor()
executeTimeoutCheck()
