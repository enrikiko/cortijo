const express = require('express');
var cors = require('cors')
const app = express();
app.use(cors());
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', client => {
  client.on('event', data => { /* … */ });
  client.on('disconnect', () => { /* … */ });
});

server.listen(3000);
