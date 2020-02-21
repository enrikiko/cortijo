var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//
app.get('/*', (req, res) => {
  console.log('express connection');
});
//
io.on('connection', socket => {
  socket.on('event', function (data) {
    console.log(data);
    socket.emit('user', data);
  });
});
//
http.listen(3000, () => console.log('listening on http://localhost:3000/'));
