const express = require("express");
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });
const app = express();
var http = require('http').Server(app);
var io = http;

// function send(name, msg) {
//   certain=false
//   wss.clients.forEach(function each(client) {
//     if (client.name == name && ws.isAlive == true) {
//       client.send(msg)
//       certain=true
//     }
//   });
//   if(certain){
//   console.log("Message send successfully")
// }else {
//   console.log(name + " not exit.")}
// }

app.get("/devices", function(req, res) { //OK
  var devices = getDevices()
  res.status(200).json(devices)
})

app.post("/:device/:status", function(req, res) {
  device = req.params.device
  status = statusToStatus(req.params.status)
  var result
  if(status){
    updateDevice(device, status)
  }
  if (result) {
    res.status(200).send(status)
  }else{
    res.status(500).send()
  }
})

function getDevices() {
  devices={}
  wss.clients.forEach(function each(client) {
    if (client.name) {
      devices[client.name]=client.status
    }
  })
  return devices
}

function addDevice(device, ws) {
  if(checkIfDeviceExist(device)){
    //console.log("device exist");
    return false }
  else {
    console.log('%s enrolled', device );
    ws.name = device
    return true;
  }
}

function checkIfDeviceExist(device){
  var certain = false
  wss.clients.forEach(function each(client) {
    if (client.name) {
      if (client.name == device) { certain = true }
    }
  })
  return certain;
}

function updateDevice(device, status) {
  certain = false
  wss.clients.forEach(function each(client) {
    if (client.name == device && client.isAlive == true) {
      //status=statusToString(status)
      //if (status) {
        client.send(status)
        //client.status=status
        certain = true
      //}
    }
  })
  return certain;
}

function statusToStatus(status) {
  if ( typeof status == 'string' && ( status == "true" || status == "false" )) {
    return status
  }
  else {
    return false;
  }
}

function check() {
  wss.clients.forEach(function each(client) {
        console.log("\nDevice: %s Status: %s" , client.name, client.isAlive);
  })
}

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) {
      return ws.terminate()
    }
    ws.isAlive = false;
    ws.ping(noop);
  });
}, 1000);

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

function getMsg(message) {
  try {
    const msg = JSON.parse(message)
    return msg;
  } catch (error) {
    console.error("\nError 001. Cannot parse the message");
    return false;
  }
}


function logic(message, ws) {
  if(message.name){
    const name = message.name
    if(addDevice(name, ws)){
      ws.send('Welcome ' + ws.name)
    }else{
      ws.send('Error 001. Device already exist')
    }
  }
  // else if (message.device & message.status) {
  //   send(message.device, message.status)
  //   updateDevice(message.device, message.status)
  // }
}

wss.on('connection', function connection(ws, request, client) {

  /*Get request IP*/
  console.log('\nNew connection from ip: %s' , request.socket.remoteAddress);

  /*Check connection*/
  ws.isAlive = true;

  ws.on('pong', heartbeat);

  ws.on('close', function close() {
    console.log('close');
  });

  ws.on('message', function incoming(message) {
    message=getMsg(message)
    if (message) {
      logic(message, ws)
    }
  });

/*End of wss*/
});


http.listen(3001, function () {
    console.log('Servidor activo en http://localhost:3001');
  })