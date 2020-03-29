const startDate = Date();
const { exec } = require('child_process');
const express = require("express");
const myDevice = require('./devices');
const watering = require('./watering');
const joker = require('./joker');
const logs = require('./logs');
const wifi = require('./wifi');
const myTemperature = require('./temperature');
const myHumidity = require('./humidity');
const requests = require('./requests');
const mySensor = require('./sensors');
const timeout = require('./timeout');
const config = require('./config');
const myTask = require('./task');
const mySwitch = require('./switch');
const cors = require('cors');
const bodyParser = require('body-parser');
//const auth = require('basic-auth');
const app = express();
const fs = require('fs')
const yaml = require('js-yaml')
const cookieParser = require('cookie-parser');
app.enable('trust proxy');
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
//app.use(express.urlencoded())
app.use(express())
app.enable('trust proxy')
const version = config.get("version");
//const REFRESH_DELAY = config.get("refresh_delay")
//const SENSOR_HISTORY = config.get("sensor_history")
//
app.get("/readiness", function(req, res) {res.status(200).send()})
//
app.get("/liveness", function(req, res) {res.status(200).send()})
//
app.get("/*", function(req, res, next) {
  const host = (req.get('host')) ? (req.get('host')) : ("localhost")
  var fullUrl = req.protocol + '://' + host + req.originalUrl;
  var ip = req.ip
  logs.newLog(ip, fullUrl)
  next()
})
//
app.post("/*", function(req, res, next) {
  const host = (req.get('host')) ? (req.get('host')) : ("localhost")
  var fullUrl = req.protocol + '://' + host + req.originalUrl;
  var ip = req.ip
  logs.newLog(ip, fullUrl)
  next()
})
app.post("/task",async function (req, res) {
  name = req.body.name;
  description = req.body.description;
  var result = await myTask.newTask(name, description)
  if(result){res.status(201).send()}
  else {
    res.status(200).send()
  }
})
app.get("/task/:name/:description",async function (req, res) {
  name = req.params.name;
  description = req.params.description;
  var result = await myTask.newTask(name, description)
  if(result){res.status(201).send()}
  else {
    res.status(200).send()
  }
})
app.post("/task/update",async function (req, res) {
  name = req.body.name;
  status = req.body.status;
  var result = await myTask.updateTask(name, status)
  if(result){res.status(201).send()}
  else {
    res.status(200).send()
  }
})
app.get("/task/:status",async function (req, res) {
  status = req.params.status;
  var result = await myTask.getTasks(status)
  if(result){res.status(200).json(result)}
  else {
    res.status(200).send()
  }
})
//
//Get log
app.get("/info", function(req, res) {
    var info = {"Version": version, "Start time": startDate}
    res.status(200).json(info)
})
//
app.get("/config", function(req, res) {
    res.status(200).json(config.getValues())
})
//
//TODO after JWT
app.post("/config/update",async function(req, res) {
    await config.safeValues(req.body)
    res.status(200).json(config.getValues())
})
//
//favicon.ico
app.get("/favicon.ico", async function(req, res) {
    res.status(200).send(fs.readFileSync('favicon.ico'))
})
// node
app.get("/logo", async function(req, res) {
    res.status(200).send(fs.readFileSync('node.png'))
})
//
//Get wifi signal
app.get("/wifi/:wifi", async function(req, res) {
    wifiName = req.params.wifi;
    var signal = await wifi.getBySSID(wifiName);
    res.status(200).send(signal.reverse())
})
//
app.get("/wifis", async function(req, res) {
    wifiList = ["test_wifi","Cuarto2.4G","WifiSalon","Cuarto2.4G_2"];
    res.status(200).send(wifiList)
})
//
//Auth with user & password
app.put("/auth", async function(req, res) {
    user = req.body.user;
    password = req.body.password;
    try{
        var jwt = await joker.auth(user, password);
        logs.log("jwt: "+jwt);
        res.cookie('jwt',jwt);
        data={"status":true}
        data.jwt=jwt
        if(jwt!="Invalid credentials"){res.status(200).json(data)}
        else{res.status(401).json({"status":false})}
    } catch(e){
        res.status(e.status).json({"status":false})
    } finally {
      logs.log(user +" has log-in")
    }
})
//Create new user
app.post("/auth", async function(req, res) {
  user = req.body.user;
  password = req.body.password;
  secret = req.body.secret;
  try {
    var response = await joker.newUser(user, password, secret);
    jwt = response.jwt
    if(jwt){res.status(201).json(response)}
    else{res.status(200).json(response)}
  } catch (e) {
    logs.error(e);
    res.status(200).json(e)
  } finally {
    logs.log("User " + user +" has been create")
  }
})
//
//New device
app.post("/device/:name/:status/:ip", async (req, res) => {
     var name = req.params.name
     var ip = req.params.ip
     var status = joker.getStatus(req.params.status)
     var id = await myDevice.getIdByName(name)
     if(status===null){
            res.status(400).json({"Request": "Incorrect", "Status": "Not boolean"})
       }else{
          if (!id) {
             var response = await myDevice.newDevice(name, status, ip)
             logs.log(name+' have been created successfully');
             res.status(200).json(name+' create successfully')
          }else {
             var lastIp = await myDevice.updateDeviceIp(id, ip)
             res.status(200).json({"Previous Ip": lastIp, "New Ip": ip})
          }
     }
})
//
//New sensor
app.post("/sensor/:type/:name/:ip", async (req, res) => {
     var name = req.params.name
     var ip = req.params.ip
     var type = req.params.type
     var devices = req.query.devices
     var min = req.query.min
     var max = req.query.max
     var id = await mySensor.getIdByName(name)
      if (!id) {
         var response = await mySensor.newSensor(name, ip, type, devices, min, max)
         logs.log(name+' have been created successfully');
         res.status(200).json(name+' create successfully')
      }else {
         var lastIp = await mySensor.updateSensor(id, ip, devices, min, max)
         res.status(200).json({"Previous Ip": lastIp, "New Ip": ip, "Devices": devices})
      }
})
//
//Get all device
app.get("/sensor/all", async function(req, res) {
    var response = await mySensor.getAllSensor();
    res.status(200).json(response)
})
//
app.get("/sensor/:name", async function(req, res) {
    var name = req.params.name;
    var id = await mySensor.getIdByName(name)
    if (id){
      var response = await mySensor.getSensorByName(name);
      res.status(200).json(response[0])
    }else {
      logs.error(name+" doesn't Exist");
      res.status(200).json("Sensor doesn't Exist")
    }
})
//
// JWT verification
app.get("/jwt", async function(req, res) {
   const jwt = req.headers.authorization
   try{
       user = await joker.getUserByJWT(jwt)
       res.status(200).json({"jwt":user.text,"status":true})
   }catch(e){
       //console.log(e)
       res.status(401).json({"jwt":"Incorrect","status":false})
   }
})
//
//TODO too much data is create the app collapse
//app.get("/all/request", async function(req, res) {
//    var response = await requests.getAllRequest();
//    res.status(200).json({response})
//})
//
app.get("/ip/all", async function(req, res) {
   var response = await requests.getAllIp();
   res.status(200).json([response])
})
//
//Get all device
app.get("/device/all", async function(req, res) {
    var response = await myDevice.getDevice();
    res.status(200).json(response)
})
//
//Get temperature and humidity history
//TODO add to documentation
app.get("/all/temperature/:name",async function(req, res) {
   var name = req.params.name;
   var time = parseInt(config.get("sensor_history"))
   var temperature = await myTemperature.getByName(name, time)
   res.status(200).json(temperature.reverse())
})
//TODO add to documentation
app.get("/all/temperature/:name/:times",async function(req, res) {
   var name = req.params.name;
   var time = req.params.times
   var temperature = await myTemperature.getByName(name, time)
   res.status(200).json(temperature.reverse())
})
//
//Get humidity history
app.get("/all/humidity/:name",async function(req, res) {
   var name = req.params.name;
   var time = parseInt(config.get("sensor_history"))
   var humidity = await myHumidity.getAll(name, time)
   res.status(200).json(humidity.reverse())
})
app.get("/all/humidity/:name/:times",async function(req, res) {
   var name = req.params.name;
   var time = req.params.times
   var humidity = await myHumidity.getAll(name, time)
   res.status(200).json(humidity.reverse())
})
//
app.get("/all/watering", async function(req, res) {
  const watering_list = await watering.getAllRequest()
  res.status(200).json(watering_list)
})
//
//Set temperature and humidity
app.get("/set/humidity/:humidity", function(req, res) {
  myHumidity.newHumidity(req.params.humidity)
  res.status(200).send()
})
//TODO
//Delete temperature history
app.delete("/temperature/history/:name",async function(req, res) {
     var name = req.params.name;
     var result = await myTemperature.deleteByName(name)
     res.status(200).send(result)
})
//
//Get device by name
app.get("/device/:name", async function(req, res) {
    var name = req.params.name;
    var deviceList = await myDevice.getDeviceByName(name);
    res.status(200).json(deviceList[0])
})
//
//Get status of device
app.get("/status/:device", async function(req, res) {
  var name = req.params.device;
  var id = await myDevice.getIdByName(name) //Get ID of the device
  if ( !id ) {
    res.status(404).json({"Request": "Incorrect", "Device": "Not found"})
  }else {
    try {
      var status = await joker.getDeviceStatus(name) //Get device status
      await myDevice.checkDeviceByName(name)
      res.status(200).json(status)
    }catch (e) {
      logs.error(name + " doesn't response")
      await myDevice.blockDeviceByName(name);
      res.status(404).json({"error": e})
      }
  }
})
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////                     Secure request JWT needed                 /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
app.delete("/*", async function(req, res, next) {
    //console.log(req)
    try{
        let jwt = req.headers.authorization
        let user = await joker.getUserByJWT(jwt)
        next()
    }catch(e){
       logs.error(e)
       res.status(401).json({"jwt":"Error"})
    }
})
app.get("/update/*", async function(req, res, next) {
    //console.log(req)
    try{
        let jwt = req.headers.authorization
        let user = await joker.getUserByJWT(jwt)
        next()
    }catch(e){
       logs.error(e)
       res.status(401).json({"jwt":"Error"})
    }
})
//
//update device
//var isUpdating={}
app.get("/update/:name/false", async function(req, res){
  var name = req.params.name
  var lapse = req.params.lapse_time
  var ip = req.ip
  var response = await mySwitch.changeStatusToFalse(name, res, ip)
})
app.get("/update/:name/true/:lapse_time", async function(req, res){
  var name = req.params.name
  var lapse = req.params.lapse_time
  var ip = req.ip
  var response = await mySwitch.changeStatusToTrue(name, lapse, res, ip)
})
//Remove device by id
app.delete("/device/:name", async function(req, res) {
    var name = req.params.name;
    var id = await myDevice.getIdByName(name)
    if (id){
      var response = await myDevice.removeDeviceByName(name);
      logs.log(name+" Remove successfully");
      res.status(200).json("Device Remove successfully")
    }else {
      logs.error(name+" Doesn't Exist");
      res.status(200).json("Device Doesn't Exist")
    }
})
//Delete sensor
app.delete("/sensor/:name", async function(req, res) {
    var name = req.params.name;
    var id = await mySensor.getIdByName(name)
    if (id){
      var response = await mySensor.removeSensorByName(name);
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
  requests.newRequest(ip, fullUrl)
  res.sendFile(__dirname + '/info.html');
});
//
app.post('/*', function(req, res){
  const host = (req.get('host')) ? (req.get('host')) : ("localhost")
  var fullUrl = req.protocol + '://' + host + req.originalUrl;
  var ip = req.ip
  requests.newRequest(ip, fullUrl)
  res.sendFile(__dirname + '/info.html');
});
//
app.delete('/*', function(req, res){
  const host = (req.get('host')) ? (req.get('host')) : ("localhost")
  var fullUrl = req.protocol + '://' + host + req.originalUrl;
  var ip = req.ip
  requests.newRequest(ip, fullUrl)
  res.sendFile(__dirname + '/info.html');
});
//
// activate the listenner
app.listen(3000, function () {
  logs.log('Api active in port 3000');
})
