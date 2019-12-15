const mongoose = require('mongoose')
const logs = require('./logs')
const fs = require('fs')
const yaml = require('js-yaml')
const request = require('superagent')
let connString = 'mongodb://192.168.1.50:27017/cortijo'
const db = mongoose.connection
mongoose.connect(connString, { useNewUrlParser: true })
// Get config
const config_file = fs.readFileSync('config.yaml')
const config = yaml.safeLoad(config_file)
GET_DATA_TIMEOUT = config.get_data_timeout
//
db.on('error',function(){
logs.log("Error to connect to MongoDB Services")
});
//
db.once('open', function() {
logs.log("Connecting a MongoDB Services")
});
//
const sensorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  check: {
    type: Boolean,
    required: false
  },
});
//
let mySensor = mongoose.model('Sensors', sensorSchema);
//
async function getIpByName(sensorName){
     async function getList(name){
        return mySensor.find({name: name})
     }
     var list = await getList(sensorName)
     if (list.length > 1) {
       return "The Database is corrupted";
     }
     else if (list.length > 0) {
       var sensor = list[0]
       return sensor.ip
     }else {
       return null
     }
   }
//
module.exports = {
//
   getAllSensor: () => { return mySensor.find() },
//
   getSensorByName: (Name) => { return mySensor.find({name: Name})},
//
   newSensor: (name, ip) => {
     let sensor = new mySensor(
       {
         name: name,
         ip: ip
       });
     sensor.save(function(err, result) {
       if (err) throw err;
       if(result) {
         logs.log(result);
       }
     });
   },
//
   getIdByName: async (sensorName) => {
     async function getList(name){
        return mySensor.find({name: name})
     }
     var list = await getList(sensorName)
     if (list.length > 1) {
       return "The Database is corrupted";
     }
     else if (list.length > 0) {
       var sensor = list[0]
       return sensor._id
     }else {
       return null
     }
   },
//
   getIpByName: async (sensorName) {
     async function getList(name){
        return mySensor.find({name: name})
     }
     var list = await getList(sensorName)
     if (list.length > 1) {
       return "The Database is corrupted";
     }
     else if (list.length > 0) {
       var sensor = list[0]
       return sensor.ip
     }else {
       return null
     }
   },
//
   updateSensorIp: (id, ip) => {
     var sensor = mySensor.findById(id, function(err, result) {
       if (err) throw err
       if(result){
         result.ip = ip
         result.save()
       }
     });
     return sensor.ip;
   },
//
   removeSensorByName: (sensorName) => {
    return mySensor.deleteOne({name: sensorName}, function(err, result) {
      if (err) throw err
      if(result){
        //logs.log(result)
        }
      });
    },
//
    blockSensorByName: async (sensorName) => {
    return mySensor.find({name: sensorName}, function(err, result) {
       if (err) throw err
       if(result){
         result=result[0]
         result.check = false
         result.save()
       }
     });
    },
//
    checkSensorByName: async (sensorName) => {
    return mySensor.find({name: sensorName}, function(err, result) {
       if (err) throw err
       if(result){
         result=result[0]
         result.check = true
         result.save()
       }
     });
    },
//
    getData: async (name) => {
        async function data() {
            ip = await getIpByName(name)
            let response = await request.get("http://"+ip+"/data").timeout({response: GET_DATA_TIMEOUT});
            return response["body"];
        }
        return await data();
    },
}
