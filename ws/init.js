const express = require("express");
const WebSocket = require('ws');
const deviceStatus = require('./status');
const wss = new WebSocket.Server({ port: 3000 });
const app = express();
var http = require('http').Server(app);
var io = http;


app.get("/:tenant/devices", function(req, res) {
  var tenant = req.params.tenant
  var devices = getDevices(tenant)
  res.status(200).json(devices)
})

app.get("/:tenant/:device/data", async function(req, res) {
  var tenant = req.params.tenant
  var device = req.params.device
  var data = await getDeviceData(tenant, device)
  res.status(200).json(data)
})

app.post("/:tenant/:device/:status", async function(req, res) {
  var tenant = req.params.tenant
  var device = req.params.device
  var status = verifyStatus(req.params.status)
  logs(['%s change status to %s', req.params.device, req.params.status]);
  if( status && device && tenant ){
      updateDevice(tenant, device, status)
  }
  res.status(200).send()
})

async function getDeviceData(tenant, device){
  return await retrieveData(tenant, device)
  // return new Promise(
  //   async function(){
  //     setTimeout(
  //       async function() {
  //         while (!data) {
  //           data = await retrieveData(tenant, device)
  //           logs(['Waiting...');
  //         }
  //         return data;
  //       }, 1000
  //     )
  //   }
  // )
}

var dataObj={}

async function retrieveData(tenant, device) {

  wss.clients.forEach( function each(client) {
    if (client.name == device &&  client.tenant == tenant) { //client.isAlive == true &&

        client.send("data")
        logs(['Sending data']);
    }
  })

  return 'OK';
}

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
    logs(['%s device alrady exist', device]);
    return false
  }
  else {
    logs(['%s has been connected', device])
    status = await getDeviceStatus(tenant, device)
    ws.name = device
    ws.status = status
    ws.tenant = tenant
    if (status == null) {
      logs(['Creating %s in db', device]);
      await deviceStatus.createDevice(tenant, device, false)
    }else {
      logs(['Get privious status of %s form db', device])
      updateDevice(tenant, device, status)
    }
    return true;
  }
}

async function getDeviceStatus(tenant, device) {
  let status = await deviceStatus.getDevice(tenant, device)
  logs(['status: %s', status]);
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
  if (certain) {
    return true
  }
  else {
    logs(["Error switching %s %s ", device, status]);
    return false ;
  }
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

function check() {
  wss.clients.forEach(function each(client) {
        logs(["\nDevice: %s Status: %s" , client.name, client.isAlive]);
  })
}

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) {
      return ws.terminate()
    }
    ws.isAlive = false;
    ws.ping(noop(ws));
  });
}, 10000);

function noop(ws) {
  logs(['Ping to %s', ws.name]);
}

function heartbeat() {
  this.isAlive = true;
}

function sendPing() {
  logs(["There is a ping"]);
}

function getMsg(message) {
  try {
    const msg = JSON.parse(message)
    logs([msg]);
    return msg;
  } catch (error) {
    console.error("\n%s\nError 001. Cannot parse the message", message);
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
  }else if (message.data) {
    logs([message.data]);
    obj={}
    obj[ws.name]=message.data
    dataObj[ws.tenant]=obj
  }
  // else if (message.device & message.status) {
  //   send(message.device, message.status)
  //   updateDevice(message.device, message.status)
  // }
}

wss.on('connection', function connection(ws, request, client) {

  /*Get request IP*/
  logs(['\nNew connection from ip: %s' , request.socket.remoteAddress]);

  /*Check connection*/
  ws.isAlive = true
  ws.status = false
  ws.ip = request.socket.remoteAddress

  ws.on('pong', heartbeat);

  ws.on('ping', sendPing)

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

function logs([text) {
     let time = new Date().toLocaleString({timeZone: 'Europe/Spain'})
     let str = ' '.repeat(25 - time.length)
     text="\""+time+"\"" + str +"  :    "+"\""+text+"\""
     console.log(text);
}


http.listen(3001, function () {
    logs(['Servidor activo en http://localhost:3001']);
  })
