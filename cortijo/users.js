const mongoose = require('mongoose');
const logs = require('./logs');
let connString = 'mongodb://user_name:password@192.168.1.50:27017/users';
const db = mongoose.connection;
//mongoose.connect("mongodb://user_name:password@172.18.0.5:27017/users");
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
let myDevice = mongoose.model('User', deviceSchema);

module.exports = {

   getDevice: () => { return myDevice.find() },

   getDeviceByName: (Name) => { return myDevice.find({name: Name})},

   getDeviceById: (id) => { return myDevice.findById(id)},

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
         //logs.log(result);
       }
     });
   },

   getIdbyName: async (deviceNane) => {
     async function getList(name){
        return myDevice.find({name: name})
     }
     var list = await getList(deviceNane)
     if (list.length > 0) {
       var device = list[0]
       var id = device._id
       return id
     }else {
       return null
     }
   },

   getIpbyName: async (deviceNane) => {
     async function getList(name){
        return myDevice.find({name: name})
     }
     var list = await getList(deviceNane)
     if (list.length > 1) {
       return "The Database is corupeted";
     } else if (list.length > 0) {
       return list[0].ip
     }else {
       return null
     }
   },

   updateDevice: (id, status) => {
    return myDevice.findById(id, function(err, result) {
       if (err) throw err
       if(result){
         result.status = status
         result.save()
         //logs.log(result)
       }
     });
   },

   updateDeviceIp: (id, ip) => {
     var device = myDevice.findById(id, function(err, result) {
       if (err) throw err
       if(result){
         result.ip = ip
         result.save()
         //logs.log(result)

       }
     });
     return device.ip;
   },

   removeDeviceByName: (deviceName) => {
    return myDevice.deleteOne({name: deviceName}, function(err, result) {
      if (err) throw err
      if(result){
        //logs.log(result)
        }
      });
    }

}
