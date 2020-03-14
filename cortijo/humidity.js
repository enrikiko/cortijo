const mongoose = require('mongoose');
const logs = require('./logs');
const fs = require('fs');
const yaml = require('js-yaml');
let conf_map_file = fs.readFileSync('conf_map.yaml');
let conf_map = yaml.safeLoad(onf_map_file);
let connString = conf_map.db_url;
//let connString = 'mongodb://192.168.1.50:27017/cortijo';
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
  name: {
    type: String,
    required: true
  },
});

let myHumidity = mongoose.model('Humidity', deviceSchema);

module.exports = {

  deleteAll: async () => { return myHumidity.deleteMany({}) },

  newHumidity: (name, humidity) => {
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

  getAll: async(name, time) => { return await myHumidity.find({"name":name}).sort({time:-1}).limit(time)}
}
