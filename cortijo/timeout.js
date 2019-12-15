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
function executeTimeout(){
    setTimeout(function(){
            logs.log("Time out executing every "+TIMEOUT+" milliseconds")
            executeTimeout()
        }, TIMEOUT);
}
executeTimeout()
