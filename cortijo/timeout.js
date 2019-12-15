const sensors = require('./sensors');
const logs = require('./logs');
const request = require('superagent');
const req = require('request');
const fs = require('fs');
const yaml = require('js-yaml')
// Get config
const config_file = fs.readFileSync('config.yaml');
const config = yaml.safeLoad(config_file);
const TIMEOUT = config.timeout
//
function executeTimeout(){
    setTimeout(function(){
            executeTimeout()
            logs.log("Time out executing every " + TIMEOUT + " milliseconds")
            getSensor()
        }, TIMEOUT);
}
//
async function getSensor(){
    logs.log("getSensor fun")
    var sensorList = await sensors.getAllSensor()
    logs.log(sensorList)
    for (var sensor in sensorList){
        logs.log(sensor)
    }
}
//
executeTimeout()
