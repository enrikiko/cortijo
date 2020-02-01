// var WebSocketServer = require('ws')
// var https = require('https');
// var server = https.createServer(function (req, res) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.writeHead(404);
//     res.end();
// });
// var wss = new WebSocketServer({ server})
//
// wss.on('connection', function(ws) {
//   ws.on('message', function incoming(message) {
//   console.log('received: %s', message);
// });
//   ws.send('something');
// })
//
//
//
// server.listen(3000, function() {
//     console.log(' Server is listening on port 3000');
// });


const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

const server = https.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});

server.listen(3000, function() {
    console.log(' Server is listening on port 3000');
});
