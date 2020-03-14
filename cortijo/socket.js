var io = require('socket.io-client')
const fs = require('fs');
const yaml = require('js-yaml');
let conf_map = fs.readFileSync('conf_map.yaml');
let config = yaml.safeLoad(conf_map);
let socket_url = config.socket_url;
var socket = io(socket_url);
const logs = require('./logs');

socket.on('alert_device', function (data) {
    logs.log('[Socket.IO] (alert_device) : ' + data);
  });

socket.on('alert_angular', function (data) {
    logs.log('[Socket.IO] (alert_angular) : ' + data);
  });

module.exports = {
  device:(msg)=>{socket.emit('event_device', msg);},
  wifi:(msg)=>{socket.emit('event_wifi', msg);},
  data:(msg)=>{socket.emit('event_data', msg);}
  }
