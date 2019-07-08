const mongoose = require('mongoose');
let connString = 'mongodb://mongo/';
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
  temperature: {
    type: String,
    required: false
  },
  humidity: {
    type: String,
    required: true
  },
});

let myTemperature = mongoose.model('Temperature', deviceSchema);

module.exports = {

  newDevice: (time, temperature, humidity) => {
    let device = new myTemperature(
      {
        time: time,
        temperature: temperature,
        humidity: humidity
      });
    device.save(function(err, result) {
      if (err) throw err;
      if(result) {
        console.log(result);
      }
    });
  },

  getAll: () => { return myTemperature.find() },

}
