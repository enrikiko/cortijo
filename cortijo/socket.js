var io = require('socket.io-client')
var socket = io('http://192.168.1.50:8200');
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
