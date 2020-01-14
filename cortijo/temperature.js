const mongoose = require('mongoose');
const logs = require('./logs');
let connString = 'mongodb://192.168.1.50:27017/cortijo';
const db = mongoose.connection;
mongoose.connect(connString, { useNewUrlParser: true });
//
db.on('error',function(){
logs.log("Error to connect to MongoDB Temperature");
});
//
db.once('open', function() {
logs.log("Connected to  MongoDB Temperature");
});
//
const temperatureSchema = new mongoose.Schema({
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
  name: {
    type: String,
    required: true
  },
});
//
const temperatureList = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});
//
let myTemperature = mongoose.model('Temperature', temperatureSchema);
let myList = mongoose.model('Temperature', temperatureList);
//
module.exports = {
//
  getList: async () => { return myList.find() },
//
  deleteName: async (name) => { return myTemperature.deleteMany({"name":name}) },
//
  newTemperature: (name, temperature, humidity) => {
    let newMeasure = new myTemperature(
      {
        time: new Date().getTime(),
        temperature: temperature,
        humidity: humidity,
        name: name
      });
    newMeasure.save(function(err, result) {
      if (err) throw err;
      if(result) {
        logs.log(result);
      }
    });
  },
//
//  getAll: async() => { return await myTemperature.find() },
//
  getByName: async(name) => { return await myTemperature.find({"name":name}) }

}
