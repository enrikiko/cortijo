const startDate = Date();

const { exec } = require('child_process');
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs')
const yaml = require('js-yaml')
const cookieParser = require('cookie-parser');

const myDevicesChanges = require('./devicesChanges');
const saveRequests = require('./saveRequests');
const myTemperature = require('./temperature');
const myHumidity = require('./humidity');
const mySensor = require('./sensors');
const myDevice = require('./devices');
const mySwitch = require('./switch');
const timeout = require('./timeout');
const request = require('./request');
const config = require('./config');
const myTask = require('./task');
const logs = require('./logs');
// const wifi = require('./wifi');
const tenants = require('./tenants')


app.enable('trust proxy');
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use(express())

const version = config.get("version");
//
app.get("/readiness", function(req, res) {res.status(200).send()})
//
app.get("/liveness", function(req, res) {res.status(200).send()})
//
//  Get Info
//
app.get("/info", function(req, res) {
    var info = {"Version": version, "StartTime": startDate}
    res.status(200).json(info)
})
//
//favicon.ico
app.get("/favicon.ico", async function(req, res) {
    res.status(200).send(fs.readFileSync('files/favicon.ico'))
})
//Robots.txt
app.get("/robots.txt", async function(req, res) {
    res.status(200).send(fs.readFileSync('files/Robots.txt'))
})
// node
app.get("/logo", async function(req, res) {
    res.status(200).send(fs.readFileSync('files/node.png'))
})
// Create new tenant
//
app.post("/newTenant", async function (req, res) {
  name = req.body.name;
  let password = tenants.createTenantPassword(name)
  var result = await tenants.createTenant(name, password)
  if(result){res.status(201).json({'name':name, 'password':password})}
  else {
    res.status(400).send()
  }
})
//
app.get("/tenants", async function (req, res) {
  var result = await tenants.getTenants()
  if(result){res.status(201).send(result)}
  else {
    res.status(200).send()
  }
})
//Auth with user & password
app.put("/auth", async function(req, res) {
    user = req.body.user;
    password = req.body.password;
    tenant = req.body.tenant;
    if (user==null||password==null||tenant==null||user==""||password==""||tenant=="") {res.status(401).json({"status":false})}
    else {
      try{
          var jwt = await request.auth(tenant, user, password);
          logs.log("jwt: "+jwt);
          res.cookie('jwt',jwt);
          data={"status":true}
          data.jwt=jwt
          if(jwt!="Invalid credentials"){res.status(200).json(data)}
          else{res.status(401).json({"status":false})}
      } catch(e){
          res.status(e.status).json({"status":false})
      } finally {
        //logs.log(user +" has log-in")
      }
    }
})
//Create new user
app.post("/auth", async function(req, res) {
  user = req.body.user;
  password = req.body.password;
  tenant = req.body.tenant;
  secret = req.body.secret;
  if (user==null||password==null||secret==null||tenant==null||user==""||password==""||secret==""||tenant=="") {
    res.status(401).json({"status":false})
  }
  else {
    try {
      let isValidTenant = await tenants.checkTenantPassword(tenant, secret)
    } catch (e) {
      logs.error(e)
    } finally {
      if (isValidTenant) {
        try {
          var response = await request.newUser(tenant, user, password);
          jwt = response.jwt
          if(jwt){
              logs.log("User " + user +" has been create")
              res.status(201).json(response)
            }
          else{res.status(200).json(response)}
        } catch (e) {
          logs.error(e);
          res.status(200).json(e)
        }
      }else {
        res.status(400).send()
      }
    }
  }
})
//
//New device
app.post("/device/:name/:status/:ip", async (req, res) => {res.status(200).send()})
app.post("/device/:tenant/:name/:status/:ip", async (req, res) => {
  var tenant = req.params.tenant;
  var name = req.params.name
  var ip = req.params.ip
  var status = request.getStatus(req.params.status)
  var id = await myDevice.getIdByName(tenant, name)
  console.log(tenant);
  console.log(name);
  console.log(ip);
  console.log(status);
  console.log(id);
  if(status===null){
        res.status(400).json({"Request": "Incorrect", "Status": "Not boolean"})
   }else{
      if (!id) {
         var response = await myDevice.newDevice(tenant, name, status, ip)
         logs.log(name+' have been created successfully');
         res.status(200).json(name+' create successfully')
      }else {
         var lastIp = await myDevice.updateDeviceIp(tenant, id, ip)
         res.status(200).json({"Previous Ip": lastIp, "New Ip": ip})
      }
  }
})
//
//New sensor
app.post("/sensor/:tenant/:type/:name/:ip", async (req, res) => {
  var tenant = req.params.tenant;
  var name = req.params.name
  var ip = req.params.ip
  var type = req.params.type
  var devices = req.query.devices
  var min = req.query.min
  var max = req.query.max
  var lapse = req.query.lapse
  var id = await mySensor.getIdByName(tenant, name)
  console.log(tenant);
  console.log(name);
  console.log(ip);
  console.log(type);
  console.log(id);
  if (!id) {
     var response = await mySensor.newSensor(tenant, name, ip, type, devices, min, max, lapse)
     logs.log(name+' have been created successfully');
     res.status(200).json(name+' create successfully')
  }else {
     var lastIp = await mySensor.updateSensor(tenant, id, ip, devices, min, max, lapse)
     res.status(200).json({"Previous Ip": lastIp, "New Ip": ip, "Devices": devices})
  }
})
//
app.get("/*", function(req, res, next) {
  const host = (req.get('host')) ? (req.get('host')) : ("localhost")
  var fullUrl = req.protocol + '://' + host + req.originalUrl;
  console.log(fullUrl);
  next()
})

app.post("/*", function(req, res, next) {
  const host = (req.get('host')) ? (req.get('host')) : ("localhost")
  var fullUrl = req.protocol + '://' + host + req.originalUrl;
  console.log(fullUrl);
  next()
})
// app.put("/*", function(req, res, next) {
//   var user = req.body.user;
//   var password = req.body.password;
//   const host = (req.get('host')) ? (req.get('host')) : ("localhost")
//   var fullUrl = req.protocol + '://' + host + req.originalUrl + "/" + user + "/" + password;
//   var ip = req.ip
//   saveRequests.newRequest(ip, fullUrl)
//   next()
// })
// Tasks
//
//
// app.get("/StrobeMediaPlayback1.swf", async function(req, res) {
//     res.status(200).send(fs.readFileSync('files/StrobeMediaPlayback1.swf'))
// })
// app.get("/StrobeMediaPlayback2.swf", async function(req, res) {
//     res.status(200).send(fs.readFileSync('files/StrobeMediaPlayback2.swf'))
//})
//
//Get wifi signal
// app.get("/wifi/:wifi", async function(req, res) {
//     wifiName = req.params.wifi;
//     var signal = await wifi.getBySSID(wifiName);
//     res.status(200).send(signal.reverse())
// })
//
// app.get("/wifis", async function(req, res) {
//     wifiList = ["test_wifi","Cuarto2.4G","WifiSalon"];
//     res.status(200).send(wifiList)
// })
//
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////                     Start secure verification JWT                 /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
// JWT verification
app.get("/jwt", async function(req, res) {
   const jwt = req.headers.authorization
   try{
       data = await request.getDataJWT(jwt)
       res.status(200).json({"jwt":data.user,"status":true})
   }catch(e){
       res.status(401).json({"jwt":"Incorrect","status":false})
   }
})
app.get("/*", async function(req, res, next) {
  try{
      let jwt = req.headers.authorization
      let data = await request.getDataJWT(jwt)
      req.user = data.user
      req.tenant = data.tenant
      console.log(req.tenant);
      console.log(req.user);
      next()
  }catch(e){
     logs.error(e)
     res.status(401).json({"jwt":"Error"})
  }
})
app.post("/*", async function(req, res, next) {
  try{
      let jwt = req.headers.authorization
      let data = await request.getDataJWT(jwt)
      req.user = data.user
      req.tenant = data.tenant
      console.log(req.tenant);
      console.log(req.user);
      next()
  }catch(e){
     logs.error(e)
     res.status(401).json({"jwt":"Error"})
  }
})
app.delete("/*", async function(req, res, next) {
  try{
      let jwt = req.headers.authorization
      let data = await request.getDataJWT(jwt)
      req.user = data.user
      req.tenant = data.tenant
      console.log(req.tenant);
      console.log(req.user);
      next()
  }catch(e){
     logs.error(e)
     res.status(401).json({"jwt":"Error"})
  }
})
app.put("/*", async function(req, res, next) {
  try{
      let jwt = req.headers.authorization
      let data = await request.getDataJWT(jwt)
      req.user = data.user
      req.tenant = data.tenant
      console.log(req.tenant);
      console.log(req.user);
      next()
  }catch(e){
     logs.error(e)
     res.status(401).json({"jwt":"Error"})
  }
})
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////                     Secure request JWT needed                 /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
app.post("/task",async function (req, res) {
  var tenant = req.tenant;
  console.log('Tenant: s%', tenant);
  var name = req.body.name;
  var description = req.body.description;
  var result = await myTask.newTask(tenant, name, description)
  if(result){res.status(201).send()}
  else {
    res.status(200).send()
  }
})

app.get("/task/:name/:description",async function (req, res) {
  var tenant = req.tenant;
  var name = req.params.name;
  var description = req.params.description;
  var result = await myTask.newTask(tenant, name, description)
  if(result){res.status(201).send()}
  else {
    res.status(200).send()
  }
})

app.post("/task/update",async function (req, res) {
  var tenant = req.tenant;
  console.log('Tenant: s%', tenant);
  var name = req.body.name;
  var status = req.body.status;
  var result = await myTask.updateTask(tenant, name, status)
  if(result){res.status(201).send(true)}
  else {
    res.status(200).send()
  }
})
app.get("/task/:status",async function (req, res) {
  var tenant = req.tenant;
  var status = req.params.status;
  var result = await myTask.getTasks(tenant, status)
  if(result){res.status(200).json(result)}
  else {
    res.status(200).send()
  }
})
//
//Get all sensor
app.get("/sensor/all", async function(req, res) {
  var tenant = req.tenant;
  var response = await mySensor.getAllSensor(tenant);
  res.status(200).json(response)
})
//
app.get("/sensor/:name", async function(req, res) {
  var tenant = req.tenant;
  var name = req.params.name;
  var id = await mySensor.getIdByName(tenant, name)
  if (id){
    var response = await mySensor.getSensorByName(tenant, name);
    res.status(200).json(response[0])
  }else {
    logs.error(name+" doesn't Exist");
    res.status(200).json("Sensor doesn't Exist")
  }
})
//
app.get("/sensor/type/:name", async function(req, res) {
  var tenant = req.tenant;
  var name = req.params.name;
  var id = await mySensor.getIdByName(tenant, name)
  if (id){
    var response = await mySensor.getSensorByName(tenant, name);
    res.status(200).json(response[0].type)
  }else {
    logs.error(name+" doesn't Exist");
    res.status(404).json("Sensor doesn't Exist")
  }
})
//
//UpdateSensor
app.put("/sensor/:name", async (req, res) => {
  var tenant = req.tenant;
  var name = req.params.name
  var devices = req.query.devices
  var min = req.query.min
  var max = req.query.max
  var lapse = req.query.lapse
  var block = req.block.lapse
  var id = await mySensor.getIdByName(tenant, name)
  if (id) {
     var lastIp = await mySensor.updateSensor(tenant, id, ip, devices, min, max, lapse)
     res.status(200).send()
  }else {
    res.status(404).send("Sensor not found")
  }
})
//TODO too much data is create the container collapse
// app.get("/all/request", async function(req, res) {
//    var response = await saveRequests.getAllRequest();
//    res.status(200).json({response})
// })
//
// app.get("/ip/all", async function(req, res) {
//    var response = await saveRequests.getAllIp();
//    res.status(200).json(response)
// })
//
//Get all device
app.get("/device/all", async function(req, res) {
  var tenant = req.tenant;
  var response = await myDevice.getDevice(tenant);
  res.status(200).json(response)
})
//
app.get("/websocketDevice/all", async function(req, res) {
  var tenant = req.tenant;
  var response = await request.getWebSocketDevice(tenant);
  res.status(200).json(response)
})
//
app.get("/updateWebSocket/:name/:id/:status", async function(req, res){
  var tenant = req.tenant;
  var name = req.params.name
  var id = req.params.id
  var status = req.params.status
  //console.log("/updateWebSocket/:name/:status");
  var response = await request.changeWebSocketStatus(tenant, name, id, status)
  res.status(response).send(status)
})
//
//
//Get temperature and humidity history
//TODO add to documentation
app.get("/all/temperature/:name",async function(req, res) {
  var tenant = req.tenant;
  var name = req.params.name;
  var time = parseInt(config.get("sensor_history"))
  var temperature = await myTemperature.getByName(tenant, name, time)
  res.status(200).json(temperature.reverse())
})
//TODO add to documentation
app.get("/all/temperature/:name/:times",async function(req, res) {
  var tenant = req.tenant;
  var name = req.params.name;
  var time = req.params.times
  var temperature = await myTemperature.getByName(tenant, name, time)
  res.status(200).json(temperature.reverse())
})
//
//Get humidity history
app.get("/all/humidity/:name",async function(req, res) {
  var tenant = req.tenant;
  var name = req.params.name;
  var time = parseInt(config.get("sensor_history"))
  var humidity = await myHumidity.getAll(tenant, name, time)
  res.status(200).json(humidity.reverse())
})
app.get("/all/humidity/:name/:times",async function(req, res) {
  var tenant = req.tenant;
  var name = req.params.name;
  var time = req.params.times
  var humidity = await myHumidity.getAll(tenant, name, time)
  res.status(200).json(humidity.reverse())
})
//
// app.get("/all/requests/", async function(req, res) {
//   const request_list = await myDevicesChanges.getAllRequest()
//   res.status(200).json(request_list)
// })
//
app.get("/all/requests/:device", async function(req, res) {
  var tenant = req.tenant;
  var tenant = req.tenant;
  var device = req.params.device;
  const request_list = await myDevicesChanges.getAllRequestByDevice(tenant, device)
  res.status(200).json(request_list)
})
//
//Set temperature and humidity
// app.get("/set/humidity/:humidity", function(req, res) {
//   var tenant = req.tenant;
//   myHumidity.newHumidity(req.params.humidity)
//   res.status(200).send()
// })
//TODO
//Delete temperature history
app.delete("/temperature/history/:name",async function(req, res) {
  var tenant = req.tenant;
  var name = req.params.name;
  var result = await myTemperature.deleteByName(tenant, name)
  res.status(200).send(result)
})
//
//Get device by name
app.get("/device/:name", async function(req, res) {
  var tenant = req.tenant;
  var name = req.params.name;
  var deviceList = await myDevice.getDeviceByName(tenant, name);
  res.status(200).json(deviceList[0])
})
//
//Get status of device
app.get("/status/:device", async function(req, res) {
  var tenant = req.tenant;
  var name = req.params.device;
  var id = await myDevice.getIdByName(tenant, name) //Get ID of the device
  if ( !id ) {
    res.status(404).json({"Request": "Incorrect", "Device": "Not found"})
  }else {
    try {
      var status = await request.getDeviceStatus(tenant, name) //Get device status
      await myDevice.setCheckDeviceByName(tenant, name, true)
      res.status(200).json(status)
    }catch (e) {
      logs.error(name + " doesn't response")
      await myDevice.setCheckDeviceByName(tenant, name, false);
      res.status(404).json({"error": e})
      }
  }
})
//
// app.get("/*", async function(req, res, next) {
//     try{
//         let jwt = req.headers.authorization
//         let user = await request.getUserByJWT(jwt)
//         req.params.user = "user"
//         next()
//     }catch(e){
//        logs.error(e)
//        res.status(401).json({"jwt":"Error"})
//     }
// })
//
// Get config
app.get("/config", function(req, res) {
    res.status(200).json(config.getValues())
})
//
app.post("/config/update",async function(req, res) {
    await config.safeValues(req.body)
    res.status(200).json(config.getValues())
})
// app.get("/update/*", async function(req, res, next) {
//     try{
//         let jwt = req.headers.authorization
//         let user = await request.getUserByJWT(jwt)
//         req.user = user.text
//         next()
//     }catch(e){
//        logs.error(e)
//        res.status(401).json({"jwt":"Error"})
//     }
// })
//
//update device
//var isUpdating={}
// TODO change get to post
app.get("/update/:name/false", async function(req, res){
  var tenant = req.tenant;
  var name = req.params.name
  // var lapse = req.params.lapse_time
  var user = req.user
  console.log("/update/:name/false");
  await mySwitch.changeStatusToFalse(tenant, name, res, user)
  //res.status(200).json(response)
})
app.get("/update/:name/true/:lapse_time", async function(req, res){
  var tenant = req.tenant;
  var name = req.params.name
  var lapse = req.params.lapse_time
  var user = req.user
  console.log("/update/:name/true/:lapse_time");
  mySwitch.changeStatusToTrue(tenant, name, lapse, res, user)
  //res.status(200).json(response)
})
//Remove device by id
app.delete("/device/:name", async function(req, res) {
  var tenant = req.tenant;
  var name = req.params.name;
  var id = await myDevice.getIdByName(tenant, name)
  if (id){
    var response = await myDevice.removeDeviceByName(tenant, name);
    logs.log(name+" Remove successfully");
    res.status(200).json("Device Remove successfully")
  }else {
    logs.error(name+" Doesn't Exist");
    res.status(200).json("Device Doesn't Exist")
  }
})
//Delete sensor
app.delete("/sensor/:name", async function(req, res) {
  var tenant = req.tenant;
  var name = req.params.name;
  var id = await mySensor.getIdByName(tenant, name)
  if (id){
    var response = await mySensor.removeSensorByName(tenant, name);
    logs.log(name+" Remove successfully");
    res.status(200).json("Sensor remove successfully")
  }else {
    logs.error(name+" doesn't Exist");
    res.status(200).json("Sensor doesn't Exist")
  }
})
//
//Handel all bad requests
app.get('/*', function(req, res){
  const host = (req.get('host')) ? (req.get('host')) : ("localhost")
  var fullUrl = req.protocol + '://' + host + req.originalUrl;
  var ip = req.ip
  res.sendFile(__dirname + 'files/info.html');
});
//
app.post('/*', function(req, res){
  const host = (req.get('host')) ? (req.get('host')) : ("localhost")
  var fullUrl = req.protocol + '://' + host + req.originalUrl;
  var ip = req.ip
  // saveRequests.newRequest(ip, fullUrl)
  res.sendFile(__dirname + 'files/info.html');
});
//
app.delete('/*', function(req, res){
  const host = (req.get('host')) ? (req.get('host')) : ("localhost")
  var fullUrl = req.protocol + '://' + host + req.originalUrl;
  var ip = req.ip
  // saveRequests.newRequest(ip, fullUrl)
  res.sendFile(__dirname + 'files/info.html');
});
//
// activate the listenner
app.listen(3000, function () {
  logs.log('Api active in port 3000');
})
