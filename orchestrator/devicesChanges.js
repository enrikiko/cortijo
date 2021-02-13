const mongoose = require('mongoose');
const logs = require('./logs');
const conf_map = require('./url');
const mongo_db = conf_map.get("db_url");
const db = mongoose.connection;
mongoose.connect(mongo_db, { useNewUrlParser: true, useUnifiedTopology: true});

db.on('error',function(){
logs.error("Error al conectarse a Mongo DevicesChanges");
});

db.once('open', function() {
logs.log("Conectado a MongoDB DevicesChanges");
});

// definicion de esquema del artículo
const devicesChangesSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  lapse: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  }
});

// let myRequest = mongoose.model('DevicesChanges', devicesChangesSchema);

module.exports = {

  newRequest: (tenant, name, status, user, lapse) => {
    let myRequest = mongoose.model(tenant+'-DevicesChanges', devicesChangesSchema);
    let request = new myRequest(
      {
        time: new Date().getTime(),
        name: name,
        status: status,
        lapse: lapse/60000,
        user: user
      });
    request.save(function(err, result) {
      if (err) throw err;
      if(result) {
        //logs.log(result);
      }
    });
  },

  getAllRequest: (tenant) => {
    let myRequest = mongoose.model(tenant+'-DevicesChanges', devicesChangesSchema);
    return myRequest.find().sort({time:-1}) },

  getAllRequestByDevice: (tenant, device) => {
    let myRequest = mongoose.model(tenant+'-DevicesChanges', devicesChangesSchema);
    return myRequest.find({name:device }).sort({time:-1}) },

  getAllRequestByUser: (tenant, user) => {
    let myRequest = mongoose.model(tenant+'-DevicesChanges', devicesChangesSchema);
    return myRequest.find({user:user }).sort({time:-1}) }

}
