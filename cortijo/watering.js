const mongoose = require('mongoose');
const logs = require('./logs');
const conf_map = require('./url');
const mongo_db = conf_map.get("db_url");
const db = mongoose.connection;
mongoose.connect(mongo_db, { useNewUrlParser: true });

db.on('error',function(){
logs.log("Error al conectarse a Mongo Watering");
});

db.once('open', function() {
logs.log("Conectado a MongoDB Watering");
});

// definicion de esquema del artículo
const requestSchema = new mongoose.Schema({
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
});

let myRequest = mongoose.model('Watering', requestSchema);

module.exports = {

  newRequest: (name, lapse, status) => {
    //console.log(name, lapse);
    let request = new myRequest(
      {
        time: new Date().toLocaleString(),
        name: name,
        status: status,
        lapse: lapse/60000
      });
    request.save(function(err, result) {
      if (err) throw err;
      if(result) {
        //logs.log(result);
      }
    });
  },

  getAllRequest: () => { return myRequest.find() }

}
