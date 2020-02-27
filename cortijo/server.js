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
const mySwitch = require('./switch');
const cors = require('cors');
const delay = require('delay');
const bodyParser = require('body-parser');
const auth = require('basic-auth');
const app = express();
const fs = require('fs')
const yaml = require('js-yaml')
const cookieParser = require('cookie-parser');
app.enable('trust proxy');
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use(express.urlencoded())
app.enable('trust proxy')
const version = config.get("version");
const REFRESH_DELAY = config.get("refresh_delay")
const SENSOR_HISTORY = config.get("sensor_history")
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
    var signal = await wifi.getBySSID(wifiName, 100);
    res.status(200).send(signal.reverse())
})
//
//Auth with user & password
app.get("/auth/:user/:password", async function(req, res) {
    user = req.params.user;
    password = req.params.password;
    try{
        var jwt = await joker.auth(user, password);
        logs.log("jwt: "+jwt);
        res.cookie('jwt',jwt);
        data={"status":true}
        data.jwt=jwt
        if(jwt!="Invalid credentials"){res.status(200).json(data)}
        else{res.status(401).json({"status":false})}
    }catch(e){
        res.status(e.status).json({"status":false})
    }
})
//
//New device
app.get("/new/:name/:status/:ip", async (req, res) => {
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
//New device
app.get("/newSensor/:type/:name/:ip", async (req, res) => {
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
         var lastIp = await mySensor.updateSensorIp(id, ip, devices, min, max)
         res.status(200).json({"Previous Ip": lastIp, "New Ip": ip, "Devices": devices})
      }
})
//
//Get all device
app.get("/all/sensor", async function(req, res) {
    await delay(REFRESH_DELAY)
    var response = await mySensor.getAllSensor();
    res.status(200).json(response)
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
app.get("/all/ip", async function(req, res) {
   var response = await requests.getAllIp();
   res.status(200).json([response])
})
//
//Get all device
app.get("/all/device", async function(req, res) {
    await delay(REFRESH_DELAY)
    var response = await myDevice.getDevice();
    res.status(200).json(response)
})
//
//Get temperature and humidity history
//TODO add to documentation
app.get("/all/temperature/:name",async function(req, res) {
   var name = req.params.name;
   var time = SENSOR_HISTORY
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
   var time = SENSOR_HISTORY
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
//
//
//Set temperature and humidity
//app.get("/set/:temperature/:humidity", function(req, res) {
//  temperature = req.params.temperature;
//  humidity = req.params.humidity;
//  myTemperature.newTemperature(temperature, humidity)
//  res.status(200).send()
//})
//
//Get temperature and humidity
// app.get("/current/temperature/humidity", function(req, res) {
//   response={}
//   response.temperature=temperature;
//   response.humidity=humidity;
//   res.status(200).json(response)
// })
//TODO
//Delete temperature history
app.delete("/temperature/history/:name",async function(req, res) {
     var name = req.params.name;
     var result = await myTemperature.deleteName(name)
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
//Remove device by id
app.delete("/device/:name", async function(req, res) {
    var name = req.params.name;
    var id = await myDevice.getIdByName(name)
    if (id){
      var response = await myDevice.removeDeviceByName(name);
      logs.log(name+" Remove successfully");
      res.status(200).json("Device Remove successfully")
    }else {
      logs.log(name+" Doesn't Exist");
      res.status(200).json("Device Doesn't Exist")
    }
})
//
//Block device by id
//app.get("/block/:name", async function(req, res) {
//    var name = req.params.name;
//    var id = await myDevice.getIdByName(name)
//    if (id){
//      var response = await myDevice.blockDeviceByName(name);
//      logs.log(name+" block successfully");
//      res.status(200).json("Device block successfully")
//    }else {
//      logs.log(name+" Doesn't Exist");
//      res.status(200).json("Device Doesn't Exist")
//    }
//})
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
      logs.log(name + " doesn't response")
      await myDevice.blockDeviceByName(name);
      res.status(404).json({"error": e})
      }
  }
})
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////                     Secure request JWT needed                 /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
app.delete("/device/*", async function(req, res, next) {
    const jwt = req.headers.authorization
    console.log(req)
    try{
       user = await joker.getUserByJWT(jwt)
       next()
    }catch(e){
       console.log(e)
       res.status(404).json({"jwt":"Error"})
    }
})
app.get("/update/*", async function(req, res, next) {
    const jwt = req.headers.authorization
    //console.log(req)
    try{
       user = await joker.getUserByJWT(jwt)
       next()
    }catch(e){
       console.log(e)
       res.status(404).json({"jwt":"Error"})
    }
})
//
//update device
//var isUpdating={}
app.get("/update/:name/false", async function(req, res){

  var name = req.params.name
  var lapse = req.params.lapse_time
  var response = await mySwitch.changeStatusToFalse(name, res)
})
app.get("/update/:name/true/:lapse_time", async function(req, res){
  var name = req.params.name
  var lapse = req.params.lapse_time
  var response = await mySwitch.changeStatusToTrue(name, lapse, res)

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
app.post('/*', function(req, res){
  const host = (req.get('host')) ? (req.get('host')) : ("localhost")
  var fullUrl = req.protocol + '://' + host + req.originalUrl;
  var ip = req.ip
  requests.newRequest(ip, fullUrl)
  res.sendFile(__dirname + '/info.html');
});
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
