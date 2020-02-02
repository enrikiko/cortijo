const WebSocket = require('ws');
const delay = require('delay');
//var ws = new WebSocket('ws://88.7.67.229:8200','echo-protocol')
var ws = new WebSocket('ws://api.darwinex.com/quotewebsocket/1.0.0','echo-protocol')


ws.onopen = function(e) {
  console.log("[WebSocket:open] Connection established");
  console.log("[WebSocket:messege] Sending to server");
  ws.send(" { 'op': 'subscribe', 'productNames' : [ DWC.4.20 ] }");
};

ws.onmessage = function(event) {
  console.log(`[WebSocket:message] Data received from server: ${event.data}`);
};

ws.onclose = function(event) {
  if (event.wasClean) {
    console.log(`[WebSocket:close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    console.log('[WebSocket:close] Connection died');
  }
};

ws.onerror = function(error) {
  console.log(`[WebSocket:error] ${error.message}`);
};


module.exports = {
  send:(msg)=>{ws.send(msg)}
}
