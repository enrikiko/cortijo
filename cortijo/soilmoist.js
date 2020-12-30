const mongoose = require('mongoose');
const logs = require('./logs');
const conf_map = require('./url');
const mySensor = require('./sensors');
const mongo_db = conf_map.get("db_url");
const db = mongoose.connection;
mongoose.connect(mongo_db, { useNewUrlParser: true, useUnifiedTopology: true});
//
//
db.on('error',function(){
logs.error("Error to connect to MongoDB Soil");
});
//
db.once('open', function() {
logs.log("Connected to  MongoDB Soil");
});
//
const soilmoistSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  soilmoist: {
    type: String,
    required: true
  },
  temperature: {
    type: String,
    required: true
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
async function checkSensor(tenant, name){
  var sensor = await mySensor.getSensorByName(tenant, name)
  if (sensor.length==0) {
    mySensor.newSensor(tenant, name, 'nul', 'soil', '', '', '', '')
  }else {
    console.log(sensor[0]);
  }
}
//
module.exports = {
//
  newMeasure: (tenant, name, temperature, humidity, soilmoist) => {
    let myTemperature = mongoose.model(tenant+'_Soilmoist', soilmoistSchema);
    checkSensor(tenant, name)
    let newMeasure = new myTemperature(
      {
        time: new Date().getTime(),
        soilmoist: soilmoist,
        temperature: temperature,
        humidity: humidity,
        name: name
      });
    newMeasure.save(function(err) {
      if (err) throw err;
    });
  }
//
}
