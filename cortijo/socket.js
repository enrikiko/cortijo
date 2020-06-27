var io = require('socket.io-client')
const conf_map = require('./url');
const socket_url = conf_map.get("socket_url");
var socket = io(socket_url);
const logs = require('./logs');

socket.on('alert_device', function (data) {
    //logs.log('[Socket.IO] (alert_device) : ' + data);
  });

socket.on('alert_angular', function (data) {
    //logs.log('[Socket.IO] (alert_angular) : ' + data);
  });

module.exports = {
  device:(msg)=>{socket.emit('event_device', msg);},
  deviceSocket:(msg)=>{socket.emit('event_device_socket', msg);},
  wifi:(msg)=>{socket.emit('event_wifi', msg);},
  data:(msg)=>{socket.emit('event_data', msg);}
  }
