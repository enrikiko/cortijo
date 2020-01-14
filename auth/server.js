const version = "1.0.0";
const startDate = Date();
const { exec } = require('child_process');
const express = require("express");
const auth = require('./auth');
const jwt_auth = require('./jwt');
const cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const app = express();
const fs = require('fs')
app.enable('trust proxy');
app.use(bodyParser.json());
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
app.use(bodyParser.text({ type: 'text/html' }))
app.use(cookieParser());
app.use(cors());
app.options('*', cors());
app.use(express.urlencoded())
app.enable('trust proxy')
var http = require('http').Server(app);
var io = http;

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

//favicon.ico
app.get("/favicon.ico", async function(req, res) {
    res.status(200).send(fs.readFileSync('favicon.ico'))
  })

app.get("/auth/:user/:password", async function(req, res) {
     user = req.params.user;
     password = req.params.password;
     var status = await auth.isUser(user, password)
     if(status==true){
          generatedJWT = await jwt_auth.signAuthJwt(user)
          var responseJson = {"jwt": generatedJWT}
          res.status(200).json(responseJson)
     }
     else if(status==false){
          res.status(401).json({"jwt": "Invalid credentials"})
     }

})

app.get('/user/:user/:password',async function(req, res){
     user = req.params.user;
     password = req.params.password;
     var status = await auth.isUser(user,password)
     if(status==true){res.status(200).send(response(true))}
     else{res.status(401).send(response(false))}
});

app.get("/jwt/:jwt", async function(req, res) {
     jwt = req.params.jwt;
     try{
        payload = await jwt_auth.verifyJwt(jwt)
        isUser = await auth.isValidUser(payload.user)
        if(isUser){
            res.status(200).send(payload.user)
        }
        else{
            console.log("Unauthorized")
            res.status(401).send("Unauthorized")
        }
     }catch(e){
        console.log(e)
        res.status(404).send("ERROR2")
     }
})





// app.get("/get/jwt/:val", async function(req, res) {
//      val = req.params.val;
//      generatedJWT = await auth.signJwt(val)
//      res.status(200).json(generatedJWT)
// })
//
// app.get("/verify/jwt/:val", async function(req, res) {
//      sentJWT = req.params.val;
//      payload = await auth.verifyJwt(sentJWT)
//      res.status(200).json(payload.val)
// })

app.get("/all/:token", async function(req, res) {
     token = req.params.token;
     if(token==process.env.TOKEN){
          var all = await auth.getAll()
          res.status(200).json(all)
     }else{res.status(401).send(false)}

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
               res.status(401).send("Unauthorized")
          }
     }else{
          console.log("Token incorrect")
          res.status(401).send("Unauthorized")
     }
});

app.get('/newuser/:user/:password/:token', async function(req, res){
    user = req.params.user;
    password = req.params.password;
    token = req.params.token;
    response = {}
    if(token==process.env.TOKEN){
        console.log("Token correct")
        isCreateUser = await auth.createUser(user, password)
        if ( isCreateUser ) {
            response.status="User created successfuly"
            res.status(201).send(response)
        }else {
            response.status="User already exist"
            res.status(200).send(response)
        }
    }else{
        console.log("Token incorrect")
        response.status="Unauthorized"
        res.status(401).send(response)
    }
});

function response(status) {
return {"status":status}
}

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
