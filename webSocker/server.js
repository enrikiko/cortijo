var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({ port: 3000 })

wss.on('connection', function(ws) {
  wss.clients.forEach(function(client) {
    console.log(client.readyState)
    if (client.readyState==1) {
      client.send(Date.now())
      console.log('New Connection', Date.now());
    }
  });

  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocketServer.OPEN) {
        client.send(data);
      }
    });
  });
})
