const { exec } = require('child_process');
const express = require("express");
const myDevice = require('./users');
const joker = require('./joker');
const weather = require('./weather');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();
app.enable('trust proxy');
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use(express.urlencoded())
app.enable('trust proxy')
var http = require('http').Server(app);
var io = http;
var temperature;
var humidity;

//Middleware
app.get("/*", function(req, res, next) {
  const host = (req.get('host')) ? (req.get('host')) : ("localhost")
  var fullUrl = req.protocol + '://' + host + req.originalUrl;
  var ip = req.ip
  joker.log( fullUrl + " : " + ip )
  joker.newLogRequest(ip, fullUrl)
  next()
})

//Get log
app.get("/log", function(req, res) { //OK
  try{
    var response = joker.readLog();
    res.status(200).json({response})
  }catch(response){}
  })

// app.post("/*", function(req, res) { //OK
//   joker.log(req.get('host')+req.originalUrl)
//   joker.log(req.protocol)
//   joker.log(JSON.stringify(req.body))
//   joker.log(req.ip)
//   res.status(200).send('ok')
//   })

// app.get('/terminal', function(req, res){
//   res.sendFile(__dirname + '/terminal.html');
// });

//Get all device
app.get("/all", async function(req, res) { //OK
  try{
    var response = await myDevice.getDevice();
    res.status(200).json(response)
  }catch(response){}
  })

//Set temperature and humidity
app.get("/set/:temperature/:humidity", function(req, res) {
  temperature = req.params.temperature;
  humidity = req.params.humidity;
  joker.newLogTemperature(temperature, humidity)
  res.status(200).send()
  })

//Get temperature and humidity
app.get("/get/temperature/humidity", function(req, res) {
  response={}
  response.temperature=temperature;
  response.humidity=humidity;
  res.status(200).json(response)
  })

//Get temperature and humidity history
app.get("/get/temperature/humidity/history",async function(req, res) {
  try {
    var temperature = await weather.temperature()
  } catch (e) {
    console.log(e)
  }
  // response = {}
  // response.temperature = temperature;
  // response.humidity = humidity;
  res.status(200).json(temperature)
  })

//Get device by name
app.get("/name/:name", async function(req, res) {
  try{
    var name = req.params.name;
    var response = await myDevice.getDeviceByName(name);
    res.status(200).json(response)
  }catch(response){}
  })

//Remove user by id
app.get("/remove/:name", async function(req, res) { //OK
  try{
    var name = req.params.name;
    var id = await myDevice.getIdbyName(name)
    if (id){
      var response = await myDevice.removeDeviceByName(name);
      joker.log(name+" Remove successfully");
      res.status(200).json("Device Remove successfully")
    }else {
      joker.log(name+" Doesn't Exist");
      res.status(200).json("Device Doesn't Exist")
    }
  }catch(response){}
  })

//New device
app.get("/new/:name/:status/:ip", async (req, res) => {
  var status = joker.getStatus(req.params.status);
  if (status===null){
    res.status(400).json({"Request": "Incorrect", "Status": "Not boolean"})
  }else {
    try{
      var name = req.params.name
      var ip = req.params.ip
      //joker.log("Try to create a new device: name-"+name+" status-"+status+" ip-"+ip);
      var id = await myDevice.getIdbyName(name)
      if (!id) {
        var response = await myDevice.newDevice(name, status, ip)
        joker.log(name+' have been created successfully');
        res.status(200).json(name+' create successfully')
      }else {
        var lastIp = await myDevice.updateDeviceIp(id, ip)
        res.status(200).json({"Previous Ip": lastIp, "New Ip": ip})
      }
    }catch(response){}
  }
})

//update user
app.get("/update/:name/:status", async function(req, res){
  var status = joker.getStatus(req.params.status);
  var name = req.params.name
  if (status === null){
    res.status(400).json({"Request": "Incorrect", "Status": "Not boolean"})
  }else {
  try{

    joker.log("Change status of "+name+" to "+status);
    //Get ID of the device
    var id = await myDevice.getIdbyName(name)
    var ip = await myDevice.getIpbyName(name)
    if(!ip){res.status(400).json({"Request": "Incorrect", "Device": "Not found"})}
    else {
      var response = await joker.switchStatus(ip, status, name)
      if (response.code == 200) {
        var lastStatus = await myDevice.updateDevice(id, status)
        var newStatus = await myDevice.getDeviceById(id)
        //joker.log("Previous Status: \"" + lastStatus + "\",  New Status: \"" + newStatus + "\"")
        res.status(response.code).send(response)
      }
    }
    var lastStatus = await myDevice.updateDevice(id, status)
    var newStatus = await myDevice.getDeviceById(id)
    //joker.log("Previous Status: \"" + lastStatus + "\",\n New Status: \"" + newStatus + "\"")

  }catch(response){}
  }
})

app.get('/*', function(req, res){
  res.sendFile(__dirname + '/info.html');
});

// activate the listenner
http.listen(3000, function () {
    joker.log('Servidor activo en http://localhost:3000');
  })
