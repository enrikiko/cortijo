const mongoose = require('mongoose');
const logs = require('./logs');
const fs = require('fs');
const yaml = require('js-yaml');
let conf_map = fs.readFileSync('conf_map.yaml');
let config = yaml.safeLoad(conf_map);
let connString = config.db_url;
//let connString = 'mongodb://192.168.1.50:27017/cortijo';
const db = mongoose.connection;
//mongoose.connect("mongodb://user_name:password@172.18.0.5:27017/cortijo");
mongoose.connect(connString, { useNewUrlParser: true });

db.on('error',function(){
logs.log("Error al conectarse a Mongo Device");
});

db.once('open', function() {
logs.log("Conectado a MongoDB Device");
});

// definicion de esquema del artículo
const deviceSchema = new mongoose.Schema({
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

// definicion del modelo de dato de nuevos articulos
let myDevice = mongoose.model('Devices', deviceSchema);

module.exports = {
//
   getDevice: () => { return myDevice.find() },
//
   getDeviceByName: (name) => { return myDevice.find({name: name})},
//
   getDeviceById: (id) => { return myDevice.findById(id)},
//
   newDevice: (name, status, ip) => {
     let device = new myDevice(
       {
         name: name,
         status: status,
         ip: ip
       });
     device.save(function(err, result) {
       if (err) throw err;
       if(result) {
         logs.log(result);
       }
     });
   },
//
   getIdByName: async (deviceName) => {
     async function getList(name){
        return myDevice.find({name: name})
     }
     var list = await getList(deviceName)
     if (list.length > 1) {
       return "The Database is corrupted";
     }
     else if (list.length > 0) {
       var device = list[0]
       return device._id
     }else {
       return null
     }
   },
//
   getIpByName: async (deviceName) => {
     async function getList(name){
        return myDevice.find({name: name})
     }
     var list = await getList(deviceName)
     if (list.length > 1) {
       return "The Database is corrupted";
     }
     else if (list.length > 0) {
       var device = list[0]
       return device.ip
     }else {
       return null
     }
   },
//
   updateDevice: (id, status) => {
    return myDevice.findById(id, function(err, result) {
       if (err) throw err
       if(result){
         result.status = status
         result.save()
       }
     });
   },
//
   updateDeviceIp: (id, ip) => {
     var device = myDevice.findById(id, function(err, result) {
       if (err) throw err
       if(result){
         result.ip = ip
         result.save()
       }
     });
     return device.ip;
   },
//
   removeDeviceByName: (deviceName) => {
    return myDevice.deleteOne({name: deviceName}, function(err, result) {
      if (err) throw err
      if(result){
        //logs.log(result)
        }
      });
    },
//
    blockDeviceByName: async (deviceName) => {
    return myDevice.find({name: deviceName}, function(err, result) {
       if (err) throw err
       if(result.length==1){
         result=result[0]
         result.check = false
         result.save()
       }
     });
    },
//
    checkDeviceByName: async (deviceName) => {
    return myDevice.find({name: deviceName}, function(err, result) {
       if (err) throw err
       if(result){
         result=result[0]
         result.check = true
         result.save()
       }
     });
   },
//
}
