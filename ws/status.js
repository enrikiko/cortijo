const mongoose = require('mongoose');
const conf_map = require('./url');
const mongo_db = conf_map.get("db_url");
const db = mongoose.connection;
mongoose.connect(mongo_db, { useNewUrlParser: true  });

db.on('error',function(){
logs("Error al conectarse a Mongo");
});

db.once('open', function() {
logs("Conectado a MongoDB");
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

function logs(text) {
     let time = new Date().toLocaleString({timeZone: 'Europe/Spain'})
     let str = ' '.repeat(25 - time.length)
     text="\""+time+"\"" + str +": "+"\""+text+"\""
     console.log(text);
}

// definicion del modelo de dato de nuevos articulos
// let myDevice = mongoose.model('WebSocket', deviceSchema);

module.exports = {

    getDevice: async (tenant, device) => {
      let status = null
      let myDevice = mongoose.model(tenant+'_WebSocket', deviceSchema);
      let deviceList = await myDevice.find({device: device})
      if ( deviceList.length == 1 ) {
        status = deviceList[0].status
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
                  logs(result);
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
