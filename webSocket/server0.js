var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//
app.get('/', (req, res) => {
  console.error('express connection');
});
//
io.on('connection', socket => {
  console.error('socket.io connection');
  socket.emit('message', 'New connection');
  socket.on('sendEvent', function (data) {
    console.log(data);
    socket.emit('device', 'Something happen');
  });
});
//
http.listen(3000, () => console.error('listening on http://localhost:3000/'));
//
console.error('socket.io example');