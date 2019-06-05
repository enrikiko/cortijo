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

const error = {"error": 500}

app.get("/all", async function(req, res) { //OK
  try{
    var response = await myDevice.getDevice();
    res.status(200).json(response)
  }catch(response){
    res.status(500).json(error)
  }
  })

app.listen(3000, function () {
    joker.log('Servidor activo en http://localhost:3000');
  })
