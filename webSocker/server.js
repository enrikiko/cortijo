var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({ port: 3000 })

wss.on('connection', function(ws) {
  console.log('connection2';
  wss.clients.forEach(function(client) {
    if (client.readyState == 1) {
      client.send("New connection", Date.now())
      console.log('New Connection', Date.now());
    }
  });

  wss.on('connection', function(ws) {
    console.log('connection2';
    ws.on('message', function(data) {
      console.log('message2';
      wss.clients.forEach(function each(client) {
        if (client.readyState==1) {
          client.send(data);
        }
      });
    });
  });
})
