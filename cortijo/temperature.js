const mongoose = require('mongoose');
const logs = require('./logs');
let connString = 'mongodb://mongo/temperature';
const db = mongoose.connection;
mongoose.connect(connString);

db.on('error',function(){
logs.log("Error al conectarse a Mongo Temperature");
});

db.once('open', function() {
logs.log("Conectado a MongoDB Temperature");
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

  deleteAll: async () => { return myTemperature.deleteMany({}) },

  newTemperature: (time, temperature, humidity) => {
    let mesure = new myTemperature(
      {
        time: time,
        temperature: temperature,
        humidity: humidity
      });
    mesure.save(function(err, result) {
      if (err) throw err;
      if(result) {
        //logs.log(result);
      }
    });
  },

  getAll: async() => { return await myTemperature.find() }

}
