const express = require("express");
const cors = require('cors');
const delay = require('delay');
const app = express();
app.enable('trust proxy')
app.use(express.urlencoded()) // middleware Bodyparse
var http = require('http').Server(app);
var status = true;
var value = 1000000;


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
  info.type="Humidity"
  value = value - Math.floor((Math.random() * 25000) - 10000)
  info.content={"humidity":value}
  console.log(info);
  res.status(200).json(info)
});

app.get('/test', function(req, res){
  value = value + Math.floor((Math.random() * 50000) + 1)
  info={}
  info.content={"humidity":value}
  res.status(200).json(value)
});

http.listen(3000, function () {
    console.log('Servidor activo en http://localhost:3000');
  })
