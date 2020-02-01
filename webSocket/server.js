var WebSocketServer = require('ws').Server
var https = require('https');
var server = https.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.writeHead(404);
    res.end();
});
server.listen(3001, function() {
    console.log(' Server is listening on port 3000');
});

var wss = new WebSocketServer({ httpServer: server, port: 3000 })

wss.on('connection', function(ws) {
  ws.on('message', function(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState==1) {
        client.send(data);
      }
    });
  });
})
