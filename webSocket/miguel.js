const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const router = require('./router');
// initializing server
const app = express();
const serveStatic = require("serve-static")
const server= http.createServer(app);
const io = socketio.listen(server);
const path = require('path');
const cors = require('cors');
const port = 3000;

app.use(router);
app.use(cors());

// Statics files
app.use(serveStatic(path.join(__dirname, 'dist')));

// settings
app.set('port', process.env.PORT || 3001);

// sockets
require('./sockets')(io);

// starting the server
// server.listen(app.get('port'), () => {
//   console.log(`server on port ${app.get('port')}`);
// });


server.listen(port, () => {
  console.log("Server on port " + port);
});
