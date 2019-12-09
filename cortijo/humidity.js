const mongoose = require('mongoose');
const logs = require('./logs');
let connString = 'mongodb://192.168.1.50:27017/cortijo';
const db = mongoose.connection;
mongoose.connect(connString, { useNewUrlParser: true });

db.on('error',function(){
logs.log("Error to connect to MongoDB Humidity");
});

db.once('open', function() {
logs.log("Conected to MongoDB Humidity");
});

// definicion de esquema del artículo
const deviceSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  humidity: {
    type: String,
    required: true
  },
});

let myHumidity = mongoose.model('Humidity', deviceSchema);

module.exports = {

  deleteAll: async () => { return myHumidity.deleteMany({}) },

  newHumidity: (humidity) => {
    let newMesure = new myTemperature(
      {
        time: new Date().getTime(),
        humidity: humidity
      });
    newMesure.save(function(err) {
      if (err) throw err;
    });
  },

  getAll: async() => { return await myHumidity.find() }

}
