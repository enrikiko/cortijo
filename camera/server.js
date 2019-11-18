const version = "1.0.0";
const startDate = Date();
const { exec } = require('child_process');
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const auth = require('basic-auth');
const app = express();
const fs = require('fs')
const path = require('path');
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
var io = http;
var temperature;
var humidity;
const defaultTime = 300000 //1000=1s 60000=1min 300000=5min 900000=15min
const requireJwt = false

app.get("/camera/:camera/:day/:picture", function(req, res) {
    var day = req.params.day
    var picture = req.params.picture
    var camera = req.params.camera
    res.status(200).send(fs.readFileSync("./eramos/"+camera+"/"+day+"/images/"+picture))
})

app.get("/camera/:camera/:day", function(req, res) {
    var day = req.params.day
    var camera = req.params.camera
    dirList=fs.readdir("./eramos/"+camera+"/"+day+"/images", function(err, files) {
        if (err) {
            res.status(200).send(err)
        }else {
            res.status(200).send(files)
        }
    })
})

app.get("/camera/:camera", function(req, res) {
  var camera = req.params.camera
  dirList=fs.readdir("./eramos/"+camera+"/", function(err, files) {
      if (err) {
           res.status(200).send(err)
      }else {
           res.status(200).send(files)
      }
  })
})

app.get("/camera", function(req, res) {
  dirList=fs.readdir("./eramos/", function(err, files) {
      if (err) {
           res.status(200).send(err)
      }else {
           res.status(200).send(files)
      }
  })
})

http.listen(3000, function () {
  console.log('Servidor activo en http://localhost:3000');
})
