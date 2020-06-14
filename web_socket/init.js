// const express = require('express')
// const enableWs = require('express-ws')
//
// const app = express()
// enableWs(app)
//
// app.ws('/device', (ws, req) => {
//     ws.on('message', msg => {
//         ws.send(msg)
//         console.log(msg)
//     })
//
//     ws.on('close', () => {
//         console.log('WebSocket was closed')
//     })
// })
//
// app.listen(3000)
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', function connection(ws, request, client) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    console.log(`Received message ${message} from user ${client}`);
    // ws.send(message);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
    console.log(wss.clients.length)
  });

  // ws.send('something');
});
