const version = "1.0.0";
const startDate = Date();
const { exec } = require('child_process');
const express = require("express");
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
const list = [1,2,3,4,5,6,7,8,9]
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

app.get("/all/:token", async function(req, res) {
     token = req.params.token;
     if(token==process.env.TOKEN){
          var all = await auth.getAll()
          res.status(200).json(all)
     }else{res.status(400).send(false)}

})


app.delete('/removeuser/:user/:password/:token', async function(req, res){
     user = req.params.user;
     password = req.params.password;
     token = req.params.token;
     if(token==process.env.TOKEN){
          console.log("Token correct")
          var status = await auth.isUser(user,password)
          if(status){
               var result = await auth.removeUser(user, password)
               console.log(result)
               res.status(200).send("User removed successfuly")
          }else{
               console.log("User not exist")
               res.status(400).send("Unauthorized")
          }
     }else{
          console.log("Token incorrect")
          res.status(400).send("Unauthorized")
     }
});

app.post('/newuser/:user/:password/:token', async function(req, res){
     user = req.params.user;
     password = req.params.password;
     token = req.params.token;
     if(token==process.env.TOKEN){
          console.log("Token correct")
          var isUser = await auth.getUser(user)
          console.log(isUser)
          if(isUser.lengh==0){
               auth.createUser(user, password)
               res.status(200).send("User created successfuly")
          }else{res.status(200).send("User already exist")}

     }else{
          console.log("Token incorrect")
          res.status(400).send("Unauthorized")
     }
});

app.get('/user/:user/:password',async function(req, res){
     user = req.params.user;
     password = req.params.password;
     var status = await auth.isUser(user,password)
     if(status==true){res.status(200).send(true)}
     else{res.status(400).send(false)}
});

app.get('/*', function(req, res){
     var info = {"Version": version, "Start time": startDate, "URL": "incorrect"}
     res.status(200).json(info)
});

app.post('/*', function(req, res){
     var info = {"Version": version, "Start time": startDate, "URL": "incorrect"}
     res.status(200).json(info)
});


// activate the listenner
http.listen(3000, function () {
    console.log('Servidor activo en http://localhost:3000');
  })
