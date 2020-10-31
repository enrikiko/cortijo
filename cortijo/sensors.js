const mongoose = require('mongoose')
const logs = require('./logs')
const config = require('./config')
const GET_DATA_TIMEOUT = config.get("data_timeout")
const request = require('superagent')
const conf_map = require('./url');
const mongo_db = conf_map.get("db_url");
const db = mongoose.connection;
mongoose.connect(mongo_db, { useNewUrlParser: true, useUnifiedTopology: true});
db.on('error',function(){
logs.error("Error to connect to MongoDB Services")
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
  type: {
    type: String,
    required: true
  },
  devices: {
    type: [],
    require: false
  },
  min: {
    type: Number,
    required: false,
    min: 0,
    max: 1000000
  },
  max: {
    type: Number,
    required: false,
    min: 0,
    max: 1000000
  },
  lapse: {
    type: Number,
    required: false,
    min: 1000,
    max: 600000
  },
  increasing: {
    type: Boolean,
    required: false
  },
  lastValue: {
    type: Number,
    required: false,
    min: 0,
    max: 1000000
  },
  count: {
    type: Number,
    required: false,
    min: 0,
    max: 100
  },
  block: {
    type: Boolean,
    required: true
  }
});
//
// let mySensor = mongoose.model('Sensor', sensorSchema);
//
async function getList(tenant, name){
  let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
  var sensorList = await mySensor.find({name: name})
  return sensorList
}
async function getSensor(tenant, name){
  let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
  var sensor = await mySensor.find({name: name})
  return sensor[0]
}
async function getIpByName(tenant, sensorName){
  let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
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
   getAllSensor: (tenant) => {
    let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
    return mySensor.find() },
//
   getSensorByName: (tenant, name) => {
     let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
     return mySensor.find({name: name})},
//
   newSensor: (tenant, name, ip, type, devices, min, max, lapse) => {
     let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
     let sensor = new mySensor(
       {
         name: name,
         ip: ip,
         type: type,
         devices: devices,
         min: min,
         max: max,
         lapse: lapse,
         block: false
       });
     sensor.save(function(err, result) {
       if (err) throw err;
       if(result) {
         logs.log(result);
       }
     });
   },
//
   getIdByName: async (tenant, sensorName) => {
     let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
     var list = await getList(sensorName)
     console.log(list);
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
   getIpByName: async (tenant, sensorName) => {
     let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
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
   updateSensor: (tenant, id, ip, devices, min, max, lapse) => {
     let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
     var sensor = mySensor.findById(id, function(err, result) {
       if (err) throw err
       if(result){
         result.ip = ip
         result.devices = devices
         result.min = min
         result.max = max
         result.lapse = lapse
         result.block = false
         result.save()
       }
     });
     return sensor.ip;
   },
//
   removeSensorByName: (tenant, sensorName) => {
     let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
     return mySensor.deleteOne({name: sensorName}, function(err, result) {
      if (err) throw err
      if(result){
          logs.log(result)
        }
      });
    },
//
    setCheckSensorByName: async (tenant, name, status) => {
      let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
    return mySensor.find({name: name}, function(err, result) {
       if (err) throw err
       if(result){
         result=result[0]
         result.check = status
         result.save()
       }
     });
    },
//
    getData: async (tenant, name) => {
      let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
      async function data() {
          ip = await getIpByName(name)
          try{
              let response = await request.get("http://"+ip+"/data").timeout({response: GET_DATA_TIMEOUT});
              return response["body"];
          }catch(e){
              return e
          }
        }
        return await data();
    },
    getMin: async (tenant, name) => {
      let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
      var list = await getList(name)
      if (list.length > 1) {
        return "The Database is corrupted";
      }
      else if (list.length > 0) {
        var sensor = list[0]
        return sensor.min
      }else {
        return null
      }
    },
    getMax: async (tenant, name) => {
      let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
      var list = await getList(name)
      if (list.length > 1) {
        return "The Database is corrupted";
      }
      else if (list.length > 0) {
        var sensor = list[0]
        return sensor.max
      }else {
        return null
      }
    },
    getLapse: async (tenant, name) => {
      let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
      var list = await getList(name)
      if (list.length > 1) {
        return "The Database is corrupted";
      }
      else if (list.length > 0) {
        var sensor = list[0]
        return sensor.lapse
      }else {
        return null
      }
    },
    getDevices: async (tenant, name) => {
      let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
      var list = await getList(name)
      if (list.length > 1) {
        return "The Database is corrupted";
      }
      else if (list.length > 0) {
        var sensor = list[0]
        var devices = sensor.devices
        devices = devices["0"]
        if (devices!=null) {
          //logs.log(devices + " - type of device : " + typeof(devices))
          devices = devices.split(",")
          return devices
        }else{
          return [];
        }
      }else {
        return null
      }
    },
    increasing: async(tenant, name)=>{
      let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
      var sensor = await getSensor(name)
      return sensor.increasing
        },
    setIncreasing: async(tenant, name, status)=>{
      let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
      await mySensor.find({name: name}, function(err, result) {
         if (err) throw err
         if(result){
           result=result[0]
           result.increasing = status
           result.save()
         }
       });
    },
    getCount: async(tenant, name)=>{
      let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
      var sensor = await getSensor(name)
      return sensor.count
    },
    setCount: async(tenant, name, count)=>{
      let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
      await mySensor.find({name: name}, function(err, result) {
         if (err) throw err
         if(result){
           result=result[0]
           result.count = count
           result.save()
         }
       });
    },
    getLastValue: async(tenant, name)=>{
      let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
      var sensor = await getSensor(name)
      return sensor.lastValue
    },
    setLastValue: async(tenant, name, lastValue)=>{
      let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
      await mySensor.find({name: name}, function(err, result) {
         if (err) throw err
         if(result){
           result=result[0]
           result.lastValue = lastValue
           result.save()
         }
       });
    },
    isBlocked: async(tenant, name)=>{
      let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
      var sensor = await getSensor(name)
      return sensor.block
    },
    blocked: async(tenant, name, status)=>{
      let mySensor = mongoose.model(tenant+'_Sensor', sensorSchema);
      await mySensor.find({name: name}, function(err, result) {
         if (err) throw err
         if(result){
           result=result[0]
           result.block = status
           result.save()
         }
       });
    }
}
