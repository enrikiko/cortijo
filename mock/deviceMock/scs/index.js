const express = require("express");
const cors = require('cors');
const delay = require('delay');
const superagent = require('superagent');
const app = express();
app.enable('trust proxy')
app.use(express.urlencoded()) // middleware Bodyparse
var http = require('http').Server(app);
var status = true;
var signal = -100;


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
    await delay(300);
    info={}
    info.status=true
    console.log(info);
    status=true;
    res.status(200).json(info)
    // try{
    //     var value = await superagent.get("https://192.168.1.53:8106/test")
    //     res.status(200).json(info)
    // }catch (e) {
    //     console.log(e);
    //     res.status(200).json(info)
    // }
});
app.get('/'+process.env.mock_name+'/status/false', async function(req, res){
    await delay(300);
    info={}
    info.status=false
    console.log(info);
    status=false;
    res.status(200).json(info)
}); 
app.get('/'+process.env.mock_name+'/status', function(req, res){
  info={}
  info.status=status
  info.SSID="test_wifi"
  signal=Math.floor((Math.random() * -10) - 50)
  info.SIGNAL=signal
  console.log(info);
  res.status(200).json(info)
});

http.listen(3000, function () {
    console.log('Servidor activo en http://localhost:3000');
  })
