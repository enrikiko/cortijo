const WebSocket = require('ws');
const delay = require('delay');
var ws = new WebSocket('ws://88.7.67.229:8200','echo-protocol')

ws.onopen = function(e) {
  console.log("[WebSocket:open] Connection established");
  console.log("[WebSocket:messege] Sending to server");
  ws.send("Hello my name is Cortijo");
};

ws.onmessage = function(event) {
  console.log(`[WebSocket:message] Data received from server: ${event.data}`);
};

ws.onclose = function(event) {
  if (event.wasClean) {
    console.log(`[WebSocket:close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    console.log('[WebSocket:close] Connection died');
  }
  reconnect()
};

ws.onerror = function(error) {
  console.log(`[WebSocket:error] ${error.message}`);
};

function reconnect() {
  retry=true
  while (retry) {
    try {
      ws = new WebSocket('ws://88.7.67.229:8200','echo-protocol')
    } catch (e) {
      console.log(e);
    } finally {
      retry=false
      console.log("Reconnect to ws://88.7.67.229:8200");
    }
    await delay(1000)
  }

}

module.exports = {
  send:(msg)=>{ws.send(msg)}
}
