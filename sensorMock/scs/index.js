const express = require("express");
const cors = require('cors');
const delay = require('delay');
const app = express();
app.enable('trust proxy')
app.use(express.urlencoded()) // middleware Bodyparse
var http = require('http').Server(app);
var status = true;
var temperature = 25;
var humidity = 43;

app.get("/*", function(req, res, next) {
  var request={}
  request.url=req.get('host')+req.originalUrl
  request.body=JSON.stringify(req.body)
  request.ip=req.ip
  request.header=req.header
  console.log(request);
  req.info=request
  next()
  })

app.get('/data', function(req, res){
  info={}
  info.name=process.env.mock_name
  info.type="Temperature"
  info.content={"temperature":temperature - Math.floor((Math.random() * 2) - 1),"humidity":humidity - Math.floor((Math.random() * 20) - 10)}
  console.log(info);
  res.status(200).json(info)
});

http.listen(3000, function () {
    console.log('Servidor activo en http://localhost:3000');
  })
