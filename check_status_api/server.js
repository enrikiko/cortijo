const { exec } = require('child_process');
const express = require("express");
const myDevice = require('./users');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();
app.enable('trust proxy')
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use(express.urlencoded())

const request = require('superagent');

// const error = {"error": 500}
//
// app.get("/all", async function(req, res) { //OK
//   try{
//     var response = await myDevice.getDevice();
//     res.status(200).json(response)
//   }catch(response){
//     res.status(500).json(error)
//   }
//   })
//
// app.listen(3000, function () {
//     console.log('Servidor activo en http://localhost:3000');
//   })
 // let listDevice=[{
 //     "_id": "5cf8327d9e1de200090b4bea",
 //     "name": "mock",
 //     "status": false,
 //     "ip": "88.8.67.178:8001",
 //     "__v": 0
 //   }]

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

async function check() {
  try {

    var listDevice = await myDevice.getDevice();
    console.log(listDevice);
    for (elem in listDevice){
      try {
        //console.log("http://"+listDevice[elem].ip+"/info");
        let res = await request.get("http://"+listDevice[elem].ip+"/info");
        //console.log(res.body);
        let save = myDevice.setStatus(listDevice[elem]._id, res.body.status)
        //console.log(save);
      } catch (e) {
        console.log(e);
      } finally {
        console.log("end");
      }
    }

  } catch (e) {
    console.log(e);
  }
}

while (true) {
  sleep(2000)
  check()
}
