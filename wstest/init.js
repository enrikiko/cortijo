var ws = new WebSocket('ws://88.7.67.229:8200','echo-protocol')

ws.onopen = function() {
  setTitle('Connected to Web Socker')
}

ws.onclose = function() {
  setTitle('Disconnected to Web Socker')
}

ws.onmessage = function(payload) {
  console.log("payload")
  console.log(payload.data)
}

function test() {
  ws.send("Hi")
}

function setTitle(title) {
  document.querySelector('h1').innerHTML = title
}
