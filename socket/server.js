var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//
app.get('/*', (req, res) => {
  console.log('express connection');
  res.send('express connection')
});
//
io.on('connection', socket => {

  socket.on('event_device', function (data) {
    console.log(data);
    io.emit('alert_device', data);
  });

  socket.on('event_device_socket', function (data) {
    console.log(data);
    io.emit('alert_device_socket', data);
  });

  socket.on('event_angular', function (data) {
    console.log(data);
    io.emit('alert_angular', data);
  });

  socket.on('event_wifi', function (data) {
    console.log(data);
    io.emit('alert_wifi', data);
  });

  socket.on('event_data', function (data) {
    console.log(data);
    io.emit('alert_data', data);
  });

});
//
http.listen(3000, () => console.log('listening on port 3000'));
