var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//
app.get('/*', (req, res) => {
  console.log('express connection');
  res.send('express connection')
});
//
app.post('/event_device', (req, res) => {
  console.log('event_device');
  io.emit('alert_device', "data");
  res.send('alert_device')
});
//
app.post('/event_device_socket', (req, res) => {
  console.log('event_device_socket');
  io.emit('alert_device_socket', "data");
  res.send('alert_device_socket')
});
//
app.post('/event_angular', (req, res) => {
  console.log('event_angular');
  io.emit('alert_angular', "data");
  res.send('alert_angular')
});
//
app.post('/event_wifi', (req, res) => {
  console.log('event_wifi');
  io.emit('alert_wifi', "data");
  res.send('alert_wifi')
});
//
app.post('/event_data', (req, res) => {
  console.log('event_data');
  io.emit('alert_data', "data");
  res.send('alert_data')
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
