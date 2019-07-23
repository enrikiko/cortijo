const version = "1.0.0";
const startDate = Date();
const { exec } = require('child_process');
const express = require("express");
//const myDevice = require('./users');
//const joker = require('./joker');
//const weather = require('./weather');
//const history = require('./history');
const auth = require('./auth');
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
//var temperature;
//var humidity;

//Middleware
app.get("/*", function(req, res, next) {
  const host = (req.get('host')) ? (req.get('host')) : ("localhost")
  var fullUrl = req.protocol + '://' + host + req.originalUrl;
  var ip = req.ip
  console.log( fullUrl + " : " + ip )
  next()
})

//Get log
app.get("/info", function(req, res) { //OK
    var info = {"Version": version, "Start time": startDate}
    res.status(200).json(info)
})

app.get('/usermock/:user/:password', function(req, res){
     user = req.params.user;
     password = req.params.password;
     var status = false;
     if(user=="Enrique" && password=="1234"){status=true}
     res.status(200).send(true)
});

app.post('/newuser/:user/:password/:token', function(req, res){
     user = req.params.user;
     password = req.params.password;
     token = req.params.token;
     if(token=="token"){
          auth.createUser(user, password)
          res.status(200).send("User created successfuly")
     }else{
          res.status(400).send("Unauthorized")
     }
});

app.get('/user/:user/:password', function(req, res){
     user = req.params.user;
     password = req.params.password;
     var status = auth.isUser(user,password)
     if(status){res.status(200).send(true)}
     else{res.status(400).send(false)}
});

app.get('/*', function(req, res){
     var info = {"Version": version, "Start time": startDate}
     res.status(200).json(info)
});


// activate the listenner
http.listen(3000, function () {
    joker.log('Servidor activo en http://localhost:3000');
  })
