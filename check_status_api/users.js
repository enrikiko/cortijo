const mongoose = require('mongoose');
let connString = 'mongodb://mongo/users';
const db = mongoose.connection;
mongoose.connect(connString);

db.on('error',function(){
console.log("Error al conectarse a Mongo");
});

db.once('open', function() {
console.log("Conectado a MongoDB");
});
// mongoose.connect('mongodb://192.168.1.50/users',{ useNewUrlParser: true }).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

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
         console.log(result);
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
         console.log(result)
       }
     });
   },

   updateDeviceIp: (id, ip) => {
     var device = myDevice.findById(id, function(err, result) {
       if (err) throw err
       if(result){
         result.ip = ip
         result.save()
         console.log(result)
       }
     });
     return device.ip;
   },

   removeDeviceByName: (deviceName) => {
    return myDevice.remove({name: deviceName}, function(err, result) {
      if (err) throw err
      if(result){
        console.log(result)
        }
      });
    }

}
