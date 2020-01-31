const WebSocket = require('ws');
let socket = new WebSocket("wss://88.7.67.229:8200");

socket.onopen = function(e) {
cosole.log("[open] Connection established");
cosole.log("Sending to server");
  socket.send("My name is John");
};

socket.onmessage = function(event) {
cosole.log(`[message] Data received from server: ${event.data}`);
};

socket.onclose = function(event) {
  if (event.wasClean) {
    cosole.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    cosole.log('[close] Connection died');
  }
};

socket.onerror = function(error) {
cosole.log(`[error] ${error.message}`);
};
