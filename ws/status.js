const mongoose = require('mongoose');
const conf_map = require('./url');
const mongo_db = conf_map.get("db_url");
const db = mongoose.connection;
mongoose.connect(mongo_db, { useNewUrlParser: true  });

db.on('error',function(){
console.log("Error al conectarse a Mongo");
});

db.once('open', function() {
console.log("Conectado a MongoDB");
});

// definicion de esquema del artículo
const deviceSchema = new mongoose.Schema({
  device: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
});

// definicion del modelo de dato de nuevos articulos
// let myDevice = mongoose.model('WebSocket', deviceSchema);

module.exports = {

    getDevice: async (tenant, device) => {
      let status = null
      let myDevice = mongoose.model(tenant+'_WebSocket', deviceSchema);
      let deviceList = await myDevice.find({device: device})
      if (deviceList.length && ( deviceList.length == 1) ) {
        status = device[0].status
      }
      return status
    },
    createDevice: async (tenant, device, status) => {
      let myDevice = mongoose.model(tenant+'_WebSocket', deviceSchema);
      let deviceList = await myDevice.find({device: device})
      if( deviceList.length > 0 ){return false}
      else{
          let newDevice = new myDevice({
              device: device,
              status: status
          });
          newDevice.save(function(err, result) {
              if (err) throw err;
              if(result) {
                  console.log(result);
              }
          });
          return true
      }
    },
    updateDevice: async (tenant, device, status) => {
      let myDevice = mongoose.model(tenant+'_WebSocket', deviceSchema);
      return myDevice.find({device: device}, function(err, result) {
        if (err) throw err
        if(result){
          result[0].status = status
          result[0].save()
        }
      });
    }
}
