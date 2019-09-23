const mongoose = require('mongoose');
const joker = require('./joker');
let connString = 'mongodb://mongo/logs';
const db = mongoose.connection;
mongoose.connect(connString);

db.on('error',function(){
joker.log("Error al conectarse a Mongo Logs");
});

db.once('open', function() {
joker.log("Conectado a MongoDB Logs");
});

// definicion de Schema del artículo
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

  newLog: (time, ip, request) => {
    let log = new myLogs(
      {
        time: time,
        request: request,
        ip: ip
      });
    log.save(function(err, result) {
      if (err) throw err;
      if(result) {
        joker.log(result);
      }
    });
  },

  getAll: () => { return myLogs.find() },

}
