var io = require('socket.io-client')
var socket = io('http://192.168.1.50:8200');
const logs = require('./logs');

socket.on('user', function (data) {
    logs.log('[Socket.IO] message: ' + data);
  });

module.exports = {
  send:(msg)=>{socket.emit('event', msg);}
  }
