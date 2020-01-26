var ws = new WebSocket('ws://88.7.67.168:8200')

ws.onopen = function() {
  setTitle('Connected to Web Socker')
}

ws.onclose = function() {
  setTitle('Disconnected to Web Socker')
}

ws.onmessage = function(payload) {
  console.log("payload")
  console.log(payload)
}

ws.addEventListener('open', function (event) {
    ws.send('Hello Server!');
});

// Listen for messages
ws.addEventListener('message', function (event) {
  //alert()
  console.log('Message from server ', event.data);
});

function test() {
  console.log("test")
  ws.send("Hi")
}

function setTitle(title) {
  document.querySelector('h1').innerHTML = title
  console.log('New connection');
}
