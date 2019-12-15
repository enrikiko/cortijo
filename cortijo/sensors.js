const mongoose = require('mongoose');
const logs = require('./logs');
let connString = 'mongodb://192.168.1.50:27017/cortijo';
const db = mongoose.connection;
mongoose.connect(connString, { useNewUrlParser: true });
//
db.on('error',function(){
logs.log("Error to connect to MongoDB Services");
});
//
db.once('open', function() {
logs.log("Connecting a MongoDB Services");
});
//
const sensorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: false
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
module.exports = {
//
   getAllSensor: () => { return mySensor.find() },
//
   getSensorByName: (Name) => { return mySensor.find({name: Name})},
//
//   getSensorById: (id) => { return mySensor.findById(id)},
//
   newSensor: (name, status, ip) => {
     let sensor = new mySensor(
       {
         name: name,
         status: status,
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
   getIpByName: async (sensorName) => {
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
   updateSensor: (id, status) => {
    return mySensor.findById(id, function(err, result) {
       if (err) throw err
       if(result){
         result.status = status
         result.save()
       }
     });
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
    }
//
}
