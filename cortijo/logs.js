const mongoose = require('mongoose');
let connString = 'mongodb://mongo/logs';
const fs = require('fs');
const db = mongoose.connection;
mongoose.connect(connString);

function log(text) {
     let time = new Date().toLocaleString()
     text="\""+time+"\""+"  :    "+"\""+text+"\""
     console.log(text);
     fs.appendFile("log.txt", text, function(err) {
        if(err) {
            console.log(err);
           }
     });
}

db.on('error',function(){
log("Error al conectarse a Mongo Logs");
});

db.once('open', function() {
log("Conectado a MongoDB Logs");
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

  log: (text) => {
     let time = new Date().toLocaleString()
     text="\""+time+"\""+"  :    "+"\""+text+"\""

     console.log(text);

     fs.appendFile("log.txt", text, function(err) {
        if(err) {
            console.log(err);
           }
     });
  },

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
        log(result);
      }
    });
  },

  getAll: () => { return myLogs.find() },

}
