const mongoose = require('mongoose');
let connString = 'mongodb://mongo/temperature';
const db = mongoose.connection;
mongoose.connect(connString);

db.on('error',function(){
console.log("Error al conectarse a Mongo Temperature");
});

db.once('open', function() {
console.log("Conectado a MongoDB Temperature");
});

// definicion de esquema del artículo
const deviceSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: false
  },
  request: {
    type: String,
    required: true
  },
});

let myTemperature = mongoose.model('Temperature', deviceSchema);

module.exports = {

  newDevice: (time, ip, request) => {
    let device = new myTemperature(
      {
        time: time,
        request: request,
        ip: ip
      });
    device.save(function(err, result) {
      if (err) throw err;
      if(result) {
        console.log(result);
      }
    });
  },

  getAll: () => { return myDevice.find() },

}
