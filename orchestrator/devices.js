const mongoose = require('mongoose');
const logs = require('./logs');
const conf_map = require('./url');
const mongo_db = conf_map.get("db_url");
const db = mongoose.connection;
mongoose.connect(mongo_db, { useNewUrlParser: true, useUnifiedTopology: true});

db.on('error',function(){
logs.error("Error al conectarse a Mongo Device");
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
// let myDevice = mongoose.model('Devices', deviceSchema);

module.exports = {
//
   getDevice: (tenant) => {
     let myDevice = mongoose.model(tenant+'_Devices', deviceSchema);
     return myDevice.find() },
//
   getDeviceByName: (tenant, name) => {
       let myDevice = mongoose.model(tenant+'_Devices', deviceSchema);
       return myDevice.find({name: name})
     },
//
   getDeviceById: (tenant, id) => {
       let myDevice = mongoose.model(tenant+'_Devices', deviceSchema);
       return myDevice.findById(id)
     },
//
   newDevice: (tenant, name, status, ip) => {
     let myDevice = mongoose.model(tenant+'_Devices', deviceSchema);
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
   getIdByName: async (tenant, deviceName) => {
     let myDevice = mongoose.model(tenant+'_Devices', deviceSchema);
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
   getIpByName: async (tenant,deviceName) => {
     let myDevice = mongoose.model(tenant+'_Devices', deviceSchema);
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
   updateDevice: (tenant, id, status) => {
    let myDevice = mongoose.model(tenant+'_Devices', deviceSchema);
    return myDevice.findById(id, function(err, result) {
       if (err) throw err
       if(result){
         result.status = status
         result.save()
       }
     });
   },
//
   updateDeviceIp: (tenant,id, ip) => {
     let myDevice = mongoose.model(tenant+'_Devices', deviceSchema);
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
   removeDeviceByName: (tenant, deviceName) => {
    let myDevice = mongoose.model(tenant+'_Devices', deviceSchema);
    return myDevice.deleteOne({name: deviceName}, function(err, result) {
      if (err) throw err
      if(result){
        //logs.log(result)
        }
      });
    },
//
    setCheckDeviceByName: async (tenant, deviceName, status) => {
     let myDevice = mongoose.model(tenant+'_Devices', deviceSchema);
     return myDevice.find({name: deviceName}, function(err, result) {
       if (err) throw err
       if(result.length==1){
         result=result[0]
         result.check = status
         result.save()
       }
     });
    },
//
   //  checkDeviceByName: async (deviceName) => {
   //  return myDevice.find({name: deviceName}, function(err, result) {
   //     if (err) throw err
   //     if(result){
   //       result=result[0]
   //       result.check = true
   //       result.save()
   //     }
   //   });
   // },
//
}
