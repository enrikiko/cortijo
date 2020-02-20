var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//
app.get('/', (req, res) => {
  console.error('express connection');
});
//
io.on('connection', s => {
  console.error('socket.io connection');
  for (var t = 0; t < 5; t++)
    setTimeout(() => s.emit('message', 'message from server'), 1000*t);
});
//
http.listen(3000, () => console.error('listening on http://localhost:3000/'));
//
console.error('socket.io example');