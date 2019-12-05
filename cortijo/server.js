const version = "1.0.0";
const startDate = Date();
const { exec } = require('child_process');
const express = require("express");
const myDevice = require('./devices');
const watering = require('./watering');
const joker = require('./joker');
const logs = require('./logs');
const myTemperature = require('./temperature');
const requests = require('./requests');
const history = require('./history');
const ia = require('./ia');
const cors = require('cors');
const delay = require('delay');
const bodyParser = require('body-parser');
const auth = require('basic-auth');
const app = express();
const fs = require('fs')
var cookieParser = require('cookie-parser');
app.enable('trust proxy');
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.options('*', cors());
app.use(express.urlencoded())
app.enable('trust proxy')
var http = require('http').Server(app);
var multer  = require('multer');
var upload = multer({ dest: '/tmp/'});
//var io = http;
var temperature;
var humidity;
//const requireJwt = false


app.get("/*", function(req, res, next) {
  const host = (req.get('host')) ? (req.get('host')) : ("localhost")
  var fullUrl = req.protocol + '://' + host + req.originalUrl;
  var ip = req.ip
  logs.newLog(ip, fullUrl)
  requests.newRequest(ip, fullUrl)
  next()
})
app.post("/*", function(req, res, next) {
  const host = (req.get('host')) ? (req.get('host')) : ("localhost")
  var fullUrl = req.protocol + '://' + host + req.originalUrl;
  var ip = req.ip
  logs.newLog(ip, fullUrl)
  requests.newRequest(ip, fullUrl)
  next()
})
//Get log
app.get("/info", function(req, res) {
    var info = {"Version": version, "Start time": startDate}
    res.status(200).json(info)
})

//Get liveness
app.get("/liveness", function(req, res) {
    res.status(200).send()
})

//favicon.ico
app.get("/favicon.ico", async function(req, res) {
    res.status(200).send(fs.readFileSync('favicon.ico'))
})

//Auth with user & password
app.get("/auth/:user/:password", async function(req, res) {
    user = req.params.user;
    password = req.params.password;
    try{
        var jwt = await joker.auth(user, password);
        logs.log("jwt: "+jwt);
        res.cookie('jwt',jwt);
        data=response(true)
        data.jwt=jwt
        if(jwt!="Invalid credentials"){res.status(200).json(data)}
        else{res.status(401).send(response(false))}
    }
    catch(e){
        res.status(e.status).send(response(false))
    }
})

function response(status) {
return {"status":status}
}

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

 //JWT verification
 app.get("/jwt", async function(req, res) {
   var jwt = "Invalid"
   jwt = await req.cookies.jwt
   console.log(jwt)
   res.status(200).json({"jwt":jwt})
//   if( requireJwt==false || jwt!=undefined ){next()}
//   else{
//     console.log("jwt is undefined")
//     res.status(401).json("Invalid credencials")
//   }
//   const host = (req.get('host')) ? (req.get('host')) : ("localhost")
//   var fullUrl = req.protocol + '://' + host + req.originalUrl;
//   var ip = req.ip
//   // logs.log( fullUrl + " : " + ip )
//   logs.newLog(ip, fullUrl)
//   requests.newRequest(ip, fullUrl)

 })

app.get("/all/request", async function(req, res) {
  //try{
    var response = await requests.getAllRequest();
    res.status(200).json({response})
 // }catch(response){console.log(respose)}
})

app.get("/all/ip", async function(req, res) {
  //try{
   var response = await requests.getAllIp();
   res.status(200).json([response])
 //}catch(response){console.log(respose)}
})

//Get all device
app.get("/all/device", async function(req, res) {
  //try{
    await delay(700)
    var response = await myDevice.getDevice();
    res.status(200).json(response)
  //}catch(response){console.log(respose)}
})

//Get temperature and humidity history
app.get("/all/temperature",async function(req, res) {
   // try {
   var temperature = await myTemperature.getAll()
   // } catch (e) {
   //   logs.log(e)
   // }
   res.status(200).json(temperature)
})

app.get("/all/log",async function(req, res) {
  // try {
  var logHistory = await history.history()
  // } catch (e) {
  //   logs.log(e)
  // }
  res.status(200).json(logHistory)
})

app.get("/all/watering", async function(req, res) {
  // console.log("/all/watering");
  const watering_list = await watering.getAllRequest()
  res.status(200).json(watering_list)
})

//Set temperature and humidity
app.get("/set/:temperature/:humidity", function(req, res) {
  temperature = req.params.temperature;
  humidity = req.params.humidity;
  myTemperature.newTemperature(temperature, humidity)
  res.status(200).send()
})

//Get temperature and humidity
app.get("/temperature/humidity", function(req, res) {
  response={}
  response.temperature=temperature;
  response.humidity=humidity;
  res.status(200).json(response)
})

//Delete temperature history
app.get("/delete/temperature/humidity/history",async function(req, res) {
   // try {
     var result = await myTemperature.deleteAll()
     res.status(200).send(result)
   // } catch (e) {
   //   logs.log(e)
   //   res.status(500).send(e)
   // }
})

//Get device by name
app.get("/name/:name", async function(req, res) {
  // try{
    var name = req.params.name;
    var response = await myDevice.getDeviceByName(name);
    res.status(200).json(response)
  // }catch(response){console.log(respose)}
})

//Remove device by id
app.get("/remove/:name", async function(req, res) {
  // try{
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
// }catch(response){console.log(respose)}
})

//Block device by id
app.get("/block/:name", async function(req, res) {
    var name = req.params.name;
    var id = await myDevice.getIdByName(name)
    if (id){
      var response = await myDevice.blockDeviceByName(name);
      logs.log(name+" block successfully");
      res.status(200).json("Device block successfully")
    }else {
      logs.log(name+" Doesn't Exist");
      res.status(200).json("Device Doesn't Exist")
    }
})

//Get status of device
app.get("/status/:device", async function(req, res) {
  // try{
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
      logs.log("no response")
      await myDevice.blockDeviceByName(name);
      res.status(404).send()
      }
  }

  // }catch(response){console.log(respose)}
})

//update device
var isUpdating={}
app.get("/update/:name/false", async function(req, res){

    var name = req.params.name
    var lapse = req.params.lapse_time
    var id = await myDevice.getIdByName(name) //Get ID of the device //

    if ( !id ) {
        res.status(404).json({"Request": "Incorrect", "Device": "Not found"})
    }else if( isUpdating[name] != true ){
        isUpdating[name]=true
        logs.log(JSON.stringify(isUpdating))
        logs.log("Change status of "+name+" to true");
        try {
            var response = await joker.switchStatus(false, name) //Change device status
            joker.switchAlert( name )
            if (response.code == 200) {
                res.status(response.code).send(response)
            }else {
                res.status(response.code).send(response)
            }
        } catch (e) {
            console.log(e)
            var response = {}
            response.code = 404
        }
        isUpdating[name]=false
    }
})
app.get("/update/:name/true/:lapse_time", async function(req, res){
  var name = req.params.name
  var lapse = req.params.lapse_time
  var id = await myDevice.getIdByName(name) //Get ID of the device //
  if ( !id ) {
    res.status(404).json({"Request": "Incorrect", "Device": "Not found"})
  }else if( isUpdating[name] != true ){
    isUpdating[name]=true
    logs.log(JSON.stringify(isUpdating))
    logs.log("Change status of "+name+" to true");
      try {
            joker.switchAlertLapse( name, lapse )
            response = await joker.switchStatus(true, name) //Change device status
            if (response.code == 200) {

                res.status(response.code).send(response)
                setTimeout(async function(){  //Change back to false
                    try {

                        var responseBack = await joker.switchStatus(false, name) //Change device status
                        if (responseBack.code == 200) {
                            logs.log("Changed back automatically due to timeout " + name + " to false")
                        }
                        else {
                            logs.log("Error changing back " + name + " to false")
                    }
                    } catch (e) {
                        console.log(e)
                        var responseBack = {}
                        responseBack.code = 404
                    }
                }, lapse);
            }else {
               res.status(200).send(response)
            }
      } catch (e) {
           console.log(e)
           var response = {}
           response.code = 404
      }
      isUpdating[name]=false
    }
})

//Handel all bad requests
app.get('/*', function(req, res){
  res.sendFile(__dirname + '/info.html');
});
app.post('/*', function(req, res){
  res.sendFile(__dirname + '/info.html');
});

// activate the listenner
http.listen(3000, function () {
  logs.log('Servidor activo en http://localhost:3000');
})