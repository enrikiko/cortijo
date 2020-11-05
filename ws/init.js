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

app.get("/:tenant/devices", function(req, res) {
  var tenant = req.params.tenant
  var devices = getDevices(tenant)
  res.status(200).json(devices)
})

app.get("/test/:device", async function(req, res) {
  device = req.params.device
  var status = await getDeviceStatus(tenant, device)
  res.status(200).json(status)
})

app.post("/:tenant/:device/:status", async function(req, res) {
  var tenant = req.params.tenant
  var device = req.params.device
  var status = statusToStatus(req.params.status) //Check status is "true" or "false"
  console.log('%s change status to %s', req.params.device, req.params.status);
  if( status && device && tenant ){

      updateDevice(tenant, device, status)

  }
  res.status(200).send()
})

function getDevices(tenant) {
  let devices=[]
  wss.clients.forEach(function each(client) {
    let device = {}
    if ( client.name && ( client.tenant == tenant ) ) {
      device.tenant=client.tenant
      device.name=client.name
      device.status=client.status
      device.ip=client.ip
      devices.push(device)
    }
  })
  return devices
}

async function addDevice(tenant, device, ws) {
  if(checkIfDeviceExist(tenant, device)){
    console.log("device exist");
    return false
  }
  else {
    console.log('%s enrolled', device )
    status = await getDeviceStatus(tenant, device)
    ws.name = device
    ws.status = status
    ws.tenant = tenant
    if (!status) {
      console.log("Creating device in db");
      await deviceStatus.createDevice(tenant, device, status)
    }else {
      console.log("Updata device form db")
      updateDevice(tenant, device, status)
    }
    return true;
  }
}

async function getDeviceStatus(tenant, device) {

  let status
  var device = await deviceStatus.getDevice(tenant, device)
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

async function updateDevice(tenant, device, status) {
  let certain = false
  wss.clients.forEach(async function each(client) {
    if (client.name == device &&  client.tenant == tenant) { //client.isAlive == true &&

        client.send(status)
        client.status = stringToboolean(status)
        certain = true
        await deviceStatus.updateDevice(tenant, device, status)

    }
  })
  if (!certain) {
    console.log("Error switching s% s% ", device, status);
  }
  return certain
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
  if(message.name&&message.tenant){
    const name = message.name
    const tenant = message.tenant
    if(addDevice(tenant, name, ws)){
      ws.send('Welcome ' + name)
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
  ws.isAlive = true
  ws.status = false
  ws.ip = request.socket.remoteAddress
  ws.on('pong', heartbeat);

  ws.on('close', function close() {
    console.log('close');
  });

  ws.on('message', async function incoming(message) {
    message = getMsg(message)
    if (message) {
      await logic(message, ws)
    }
  });

/*End of wss*/
});


http.listen(3001, function () {
    console.log('Servidor activo en http://localhost:3001');
  })
