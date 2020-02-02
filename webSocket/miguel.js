const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const app = express();
const server= http.createServer(app);
const io = socketio.listen(server);
const path = require('path');
const cors = require('cors');
const port = 3000;
app.use(cors());


const server = require('http').createServer();

const io = require('socket.io')(server);

io.on('connection', client => {
  client.on('event', data => { /* … */ });
  client.on('disconnect', () => { /* … */ });
});

server.listen(3000);
