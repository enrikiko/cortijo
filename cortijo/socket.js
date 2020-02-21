var io = require('socket.io-client')
var socket = io('http://192.168.1.50:8200');
socket.on('user', function (data) {
    console.log(data);
  });
module.exports = {
  send:(msg)=>{socket.emit('event', msg);}
}
