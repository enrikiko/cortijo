const express = require("express");
const cors = require('cors');
const delay = require('delay');
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

app.get('/'+process.env.mock_name+'/status/true', async function(req, res){
    await delay(100);
    info={}
    info.status=true
    console.log(info);
    status=true;
res.status(200).json(info)
});
app.get('/'+process.env.mock_name+'/status/false', async function(req, res){
    await delay(100);
    info={}
    info.status=false
    console.log(info);
    status=false;
res.status(200).json(info)
});
app.get('/'+process.env.mock_name+'/status', function(req, res){
  info={}
  info.status=status
  console.log(info);
  res.status(200).json(info)
});

http.listen(3000, function () {
    console.log('Servidor activo en http://localhost:3000');
  })
