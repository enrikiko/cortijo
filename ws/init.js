const express = require("express");
const WebSocket = require('ws');
const deviceStatus = require('./status');
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

app.get("/devices", function(req, res) {
  var devices = getDevices()
  res.status(200).json(devices)
})

app.get("/test/:device", async function(req, res) {
  device = req.params.device
  var status = await getDeviceStatus(device)
  res.status(200).json(status)
})

app.post("/:device/:status", function(req, res) {
  device = req.params.device
  status = statusToStatus(req.params.status) //Check status is "true" or "false"
  //console.log(status);
  if(status){
      var result = updateDevice(device, status)
  }
  res.status(200).send(status)
})

function getDevices() {
  let devices=[]
  wss.clients.forEach(function each(client) {
    let device = {}
    if (client.name) {
      device.name=client.name
      device.status=client.status
      device.ip=client.ip
      devices.push(device)
    }
  })
  return devices
}

async function addDevice(device, ws) {
  if(checkIfDeviceExist(device)){
    console.log("device exist");
    return false
  }
  else {
    console.log('%s enrolled', device )
    status = await getDeviceStatus(device)
    console.log("1")
    ws.name = device
    ws.status = status
    if (!status) {
      console.log("2")
      console.log("Creating device in db");
      await deviceStatus.createDevice(device, status)
    }else {
      console.log("3")
      console.log("Updata device form db")
      updateDevice(device, status)
    }
    console.log("4")
    return true;
  }
}

async function getDeviceStatus(device) {

  let status
  var device = await deviceStatus.getDevice(device)
  //console.log(device);
  if (device.length == 1) {
    status = device[0].status
  }else{
    status = false
  }
  return status

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
        client.status = stringToboolean(status)
        certain = true
        deviceStatus.updateDevice(device, status)
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

function stringToboolean(status) {
  if ( typeof status == 'string' && status == "true") {
    return true
  }
  else if ( typeof status == 'string' && status == "false") {
    return false;
  }else {return "Error";}
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


async function logic(message, ws) {
  if(message.name){
    const name = message.name
    if(addDevice(name, ws)){
      ws.send('Welcome ' + name)
      console.log("5")
    }else{
      ws.send('Error 001. Device already exist')
      console.log("6")
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
  ws.isAlive = true
  ws.status=false
  ws.ip=request.socket.remoteAddress
  ws.on('pong', heartbeat);

  ws.on('close', function close() {
    console.log('close');
  });

  ws.on('message', async function incoming(message) {
    message=getMsg(message)
    if (message) {
      await logic(message, ws)
    }
  });

/*End of wss*/
});


http.listen(3001, function () {
    console.log('Servidor activo en http://localhost:3001');
  })
