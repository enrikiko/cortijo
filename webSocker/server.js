var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({ port: 3000 })

wss.on('connection', function(ws) {
  ws.on('message', function(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState==1) {
        client.send(data);
      }
    });
  });
})
