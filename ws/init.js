const express = require("express");
const WebSocket = require('ws');
const deviceStatus = require('./status');
const wss = new WebSocket.Server({ port: 3000 });
const app = express();
var http = require('http').Server(app);
const httpPort = 3001
// var io = http;
var dataObj={}
var id = 0
var device_map = {}


app.get("/:tenant/devices", function(req, res) {
  var tenant = req.params.tenant
  var devices = getDevices(tenant)
  //console.log(devices);
  res.status(200).json(devices)
})

app.get("/:tenant/:device/data", async function(req, res) {
  var tenant = req.params.tenant
  var device = req.params.device
  var data = await getDeviceData(tenant, device)
  res.status(200).json(data)
})

app.post("/:tenant/:device/:id/:status", async function(req, res) {
  var tenant = req.params.tenant
  var device = req.params.device
  var id = req.params.id
  var status = verifyStatus(req.params.status)
  logs([req.params.device,' change status to ', req.params.status, 'ID: ',id]);
  if( status && device && tenant && id ){
      updateDevice(tenant, device, id, status)
  }
  res.status(200).send()
})

http.listen(httpPort, function () {
    logs(['Servidor activo en http://localhost:' + httpPort]);
  })

wss.on('connection', function connection(ws, request, client) {
  /*Get request IP*/
  logs(['New connection from ip: ' , request.headers['x-forwarded-for']]);
  /*Check connection*/

  ws.id = id++
  device_map[ws.id] = ws
  ws.isAlive = true
  ws.status = false
  ws.ip = request.headers['x-forwarded-for']

  ws.send(ws.id)

  ws.on('pong', heartbeat);

  ///ws.on('ping', sendPing)

  ws.on('close', function close() {
    logs(['%s close', ws.name]);
  });

  ws.on('message', async function incoming(message) {
    message = getMsg(message)
    if (message) {
      await logic(message, ws)
    }
  });

/*End of wss*/
});

function noop() {
  // logs(['Ping to ' + this.name]);
  // return "noop"
}

function heartbeat() {
  this.isAlive = true;
}

// function sendPing() {
//   logs(["There is a ping"]);
// }

function getMsg(message) {
  try {
    const msg = JSON.parse(message)
    logs([msg]);
    return msg;
  } catch (error) {
    logs("Error 001. Cannot parse the message");
    logs(message)
    return false;
  }
}

async function getDeviceData(tenant, device){
  let result = false
 //  wss.clients.forEach( function(client) {
 //   if (client.name == device &&  client.tenant == tenant) { //client.isAlive == true &&
 //       client.send("data")
 //       logs(['Asking for data...']);
 //         client.on('message', function(message) {
 //           message = JSON.parse(message)
 //           result = message
 //           if (message.device==device) {
 //             console.log("Eureka");
 //
 //           }else {
 //             console.log("Fuck!");
 //           }
 //         })
 //       }
 // })
 return result
}

function getDevices(tenant) {
  let devicesList=[]
  wss.clients.forEach(function each(client) {
    let device = {}
    if ( client.name && ( client.tenant == tenant ) ) {
      device.tenant=client.tenant
      device.name=client.name
      device.status=client.status
      device.ip=client.ip
      device.id=client.id
      devicesList.push(device)
    }
  })
  return devicesList
}

async function addDevice(tenant, device, ws, id) {
  if(checkIfDeviceExist(tenant, device)){
    logs([device + ' device alrady exist']);
    return false
  }
  else {
    logs([device + ' has been connected'])
    status = await getDeviceStatus(tenant, device)
    ws.name = device
    ws.status = status
    ws.tenant = tenant
    if (status == null) {
      logs(['Creating '+device+' in db']);
      await deviceStatus.createDevice(tenant, device, false)
    }else {
      logs(['Get privious status of '+device+' form db'])
      updateDevice(tenant, device, id, status)
    }
    return true;
  }
}

async function getDeviceStatus(tenant, device) {
  let status = await deviceStatus.getDevice(tenant, device)
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

async function updateDevice(tenant, device, id, status) {
  wss.clients.forEach( function each(client) {
    if (client.name == device &&  client.tenant == tenant) { //client.isAlive == true &&
        client.status = stringToboolean(status)
    }
  })
  await deviceStatus.updateDevice(tenant, device, status)
  device_map[id].send(status)
  return device_map[id].message()
  // console.log(response);
  // return true
}

function verifyStatus(status) {
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

async function logic(message, ws) {
  if(message.name && message.tenant){
    const name = message.name
    const tenant = message.tenant
    const id = ws.id
    if(addDevice(tenant, name, ws, id)){
      ws.send('Welcome ' + name)
    }else{
      ws.send('Error 001. Device already exist')
    }
  }else if (message.data) {
    logs([message.data]);
  }
  // else if (message.device & message.status) {
  //   send(message.device, message.status)
  //   updateDevice(message.device, message.status)
  // }
}

function logs(text) {
     let time = new Date().toLocaleString({timeZone: 'Europe/Spain'})
     let str = ' '.repeat(25 - time.length)
     text="\""+time+"\"" + str +": "+"\""+text+"\""
     console.log(text);
}

setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) {
      return ws.terminate()
    }
    ws.isAlive = false;
    ws.ping(noop());
  });
}, 10000);
