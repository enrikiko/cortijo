const mongoose = require('mongoose');
const logs = require('./logs');
const conf_map = require('./url');
const mongo_db = conf_map.get("db_url");
const db = mongoose.connection;
mongoose.connect(mongo_db, { useNewUrlParser: true, useUnifiedTopology: true});
db.on('error',function(){
logs.error("Error to connect to MongoDB Temperature");
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
// let myTemperature = mongoose.model('Temperature', temperatureSchema);
//
module.exports = {
//
    deleteByName: async (tenant, name) => {
      let myTemperature = mongoose.model(tenant+'_Temperature', temperatureSchema);
      return myTemperature.deleteMany({"name":name}) } ,
//
    newTemperature: (tenant, name, temperature, humidity) => {
      let myTemperature = mongoose.model(tenant+'_Temperature', temperatureSchema);
      let newMeasure = new myTemperature(
        {
          time: new Date().getTime(),
          temperature: temperature,
          humidity: humidity,
          name: name
        });
      newMeasure.save(function(err) {
        if (err) throw err;
      });
    },
//
    getByName: async(tenant, name, time) => {
      let myTemperature = mongoose.model(tenant+'_Temperature', temperatureSchema);
      return await myTemperature.find({"name":name}).sort({time:-1}).limit(time)}
}
