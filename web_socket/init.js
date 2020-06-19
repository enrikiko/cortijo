
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

var devices={}

function send(name, msg) {
  certain=false
  wss.clients.forEach(function each(client) {
    if (client.name == name) {
      client.send(msg);
      certain=true
    }
  });
  if(certain){
  console.log("Message send successfully")
}else {
  console.log(name + " not exit.")}
}

function addDevice(device) {
  devices[device]=false
}

function removeDevice(device) {
  delete devices[device]
}

function updateDevice(device, status) {
  devices[device]=status
}

wss.on('connection', function connection(ws, request, client) {

  console.log('connection');


  ws.on('open', function open() {
    console.log('open');
  });

  ws.on('close', function close() {
    console.log('close');
    removeDevice(ws.name)
  });

  ws.on('message', function incoming(message) {

    console.log('received: %s', message);
    const message_obj = JSON.parse(message);
    if(message_obj.name){
      ws.name=message_obj.name;
      console.log('%s enrolled', ws.name );
      ws.send('Welcome ' + ws.name)
      addDevice(ws.name)
    }else if (message_obj.device) {
      if (message_obj.status) {
        send(message_obj.device, message_obj.status)
        updateDevice(message_obj.device, message_obj.status)
      }
    }

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        //client.send(message);
      }
    });
    //console.log(wss.clients.length)
  });

  // ws.send('something');
});
