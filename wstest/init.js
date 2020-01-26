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

document.forms[0].onsutmit = function () {
  var input = document.getElementById('messege')
  input.value = ''
}
function setTitle(title) {
  document.querySelector('h1').innerHTML = title
  console.log('New connection');
}
function printMessege(messege) {
  var p = document.createElement('p')
  p.innerText = messege
  document.querySelector('div.messeges').appendChild(p)
}
