const mongoose = require('mongoose');
let connString = 'mongodb://mongo/';
const db = mongoose.connection;
mongoose.connect(connString);

db.on('error',function(){
console.log("Error al conectarse a Mongo Logs");
});

db.once('open', function() {
console.log("Conectado a MongoDB Logs");
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

let myLogs = mongoose.model('Logs', deviceSchema);

module.exports = {

  newDevice: (time, ip, request) => {
    let device = new myLogs(
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

  getAll: () => { return myLogs.find() },

}
