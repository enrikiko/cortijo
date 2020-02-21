var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//
app.get('/*', (req, res) => {
  console.log('express connection');
});
//
io.on('connection', socket => {

  socket.on('event_device', function (data) {
    console.log(data);
    io.emit('alert_device', data);
  });

  socket.on('event_angular', function (data) {
    console.log(data);
    io.emit('alert_angular', data);
  });

});
//
http.listen(3000, () => console.log('listening on http://localhost:3000/'));
