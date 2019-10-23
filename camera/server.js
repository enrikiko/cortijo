const version = "1.0.0";
const startDate = Date();
const { exec } = require('child_process');
const express = require("express");
const myDevice = require('./devices');
const watering = require('./watering')
const joker = require('./joker');
const logs = require('./logs');
const myTemperature = require('./temperature');
const requests = require('./requests');
const history = require('./history');
const ia = require('./ia');
const cors = require('cors');
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
var io = http;
var temperature;
var humidity;
const defaultTime = 300000 //1000=1s 60000=1min 300000=5min 900000=15min
const requireJwt = false


app.get("/*", function(req, res) {
     var info = {"Version": version, "Start time": startDate}
     res.status(200).json(info)
})


http.listen(3000, function () {
  logs.log('Servidor activo en http://localhost:3000');
})
