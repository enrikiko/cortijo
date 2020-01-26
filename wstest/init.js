var ws = new WebSocket('ws://88.7.67.168:8200')

ws.onopen = function() {
  setTitle('Connected to Web Socker')
}

ws.onclose = function() {
  setTitle('Disconnected to Web Socker')
}

ws.onmessage = function(payload) {
  printMessege(payload.data)
}

// Connection opened
ws.addEventListener('open', function (event) {
    ws.send('Hello Server!');
});

// Listen for messages
ws.addEventListener('message', function (event) {
  alert()
  //  console.log('Message from server ', event.data);
});
