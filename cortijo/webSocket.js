const WebSocket = require('ws');
const delay = require('delay');
const logs = require('./logs');
var ws = new WebSocket('ws://192.168.1.50:8200','echo-protocol')
//var ws = new WebSocket('https://protected-crag-00706.herokuapp.com/','echo-protocol')


ws.onopen = function(e) {
  logs.log("[WebSocket:open] Connection established");
  logs.log("[WebSocket:messege] Sending to server");
  ws.send(" { 'op': 'subscribe', 'productNames' : [ DWC.4.20 ] }");
};

ws.onmessage = function(event) {
  logs.log(`[WebSocket:message] Data received from server: ${event.data}`);
};

ws.onclose = function(event) {
  if (event.wasClean) {
    logs.log(`[WebSocket:close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    logs.log('[WebSocket:close] Connection died');
  }
};

ws.onerror = function(error) {
  logs.log(`[WebSocket:error] ${error.message}`);
};


module.exports = {
  send:(msg)=>{ws.send(msg)}
}
