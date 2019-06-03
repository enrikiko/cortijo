const express = require("express");
const cors = require('cors');
const app = express();
app.enable('trust proxy')
app.use(express.urlencoded()) // middleware Bodyparse
var http = require('http').Server(app);
var status = true;


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

// app.get('/status/:status', function(req, res){
//   info={}
//   info.status=req.params.status
//   res.status(200).json(info)
// });

app.get('/status/true', function(req, res){
  info={}
  info.status=true
  console.log(info);
  status=true;
  res.status(200).json(info)
});
app.get('/status/false', function(req, res){
  info={}
  info.status=false
  console.log(info);
  status=false;
  res.status(200).json(info)
});
app.get('/info', function(req, res){
  info={}
  info.status=status
  console.log(info);
  res.status(200).json(info)
});

http.listen(3000, function () {
    console.log('Servidor activo en http://localhost:3000');
  })
