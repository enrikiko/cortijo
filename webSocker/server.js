var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({ port: 3000 })

wss.on('connection', function(ws) {
  console.log('New Connection', Date.now());
})

wss.on('message', function incoming() {
  ws.send(true)
  console.log('Status update');
});
