const mongoose = require('mongoose');
// const logs = require('./logs');
let connString = 'mongodb://mongo/logs';
const fs = require('fs');
const db = mongoose.connection;
mongoose.connect(connString);

function logs(text) {
     let time = new Date().toLocaleString({timeZone: 'Europe/Spain'})
     let str = ' '.repeat(25 - time.length)
     text="\""+time+"\"" + str +"  :    "+"\""+text+"\""
     console.log(text);
     fs.appendFile("log.txt", text, function(err) {
        if(err) {
            console.log(err);
           }
     });
}

db.on('error',function(){
logs("Error al conectarse a Mongo Logs");
});

db.once('open', function() {
logs("Conectado a MongoDB Logs");
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
     logs(text)
  },

  newLog: (ip, request) => {
       let length =  (20 - ip.length) > 0 ? 20 - ip.length : 1
       let str = ' '.repeat(length)
       logs(ip + str +"  :    " + request + " ")
    let log = new myLogs(
      {
        time: new Date().getTime(),
        request: request,
        ip: ip
      });
    log.save(function(err, result) {
      if (err) throw err;
      if(result) {
        //logs(result);
      }
    });
  },

  getAll: () => { return myLogs.find() },

}
