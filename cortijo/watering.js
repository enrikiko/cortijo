const mongoose = require('mongoose');
const logs = require('./logs');
const fs = require('fs');
const yaml = require('js-yaml');
let conf_map = fs.readFileSync('conf_map.yaml');
let config = yaml.safeLoad(conf_map);
let connString = config.db_url;
//let connString = 'mongodb://192.168.1.50:27017/cortijo';
const db = mongoose.connection;
mongoose.connect(connString, { useNewUrlParser: true });

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
