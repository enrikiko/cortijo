function test(x) {
  for (var i = 0; i < x; i++) {
  send("Wemos_001", i)}
  for (var i = x; i > 0; i--) {
  send("Wemos_001", i)}
}

function check() {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
        console.log(client.name);
        console.log(client.isAlive);
        //ws.send("Test")
    }
  })
}


function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
  });
}

function noop() {console.log("noop");}
