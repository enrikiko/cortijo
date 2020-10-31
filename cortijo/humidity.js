const mongoose = require('mongoose');
const logs = require('./logs');
const conf_map = require('./url');
const mongo_db = conf_map.get("db_url");
const db = mongoose.connection;
mongoose.connect(mongo_db, { useNewUrlParser: true, useUnifiedTopology: true });

db.on('error',function(){
logs.error("Error to connect to MongoDB Humidity");
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
  name: {
    type: String,
    required: true
  },
});

// let myHumidity = mongoose.model('Humidity', deviceSchema);

module.exports = {

  deleteAll: async (tenant) => {
    let myHumidity = mongoose.model(tenant+'_Humidity', deviceSchema);
    return myHumidity.deleteMany({})
  },

  newHumidity: (tenant, name, humidity) => {
    let myHumidity = mongoose.model(tenant+'_Humidity', deviceSchema);
    let newMesure = new myHumidity(
      {
        time: new Date().getTime(),
        humidity: humidity,
        name: name
      });
    newMesure.save(function(err) {
      if (err) throw err;
    });
  },

  getAll: async(tenant, name, time) => {
    let myHumidity = mongoose.model(tenant+'_Humidity', deviceSchema);
    return await myHumidity.find({"name":name}).sort({time:-1}).limit(time)}
}
