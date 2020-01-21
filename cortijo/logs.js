//const mongoose = require('mongoose');
//let connString = 'mongodb://192.168.1.50:27017/cortijo';
// const fs = require('fs');
// const yaml = require('js-yaml')
// const config_file = fs.readFileSync('config.yaml');
// const config = yaml.safeLoad(config_file);
//
const config = require('./config');
const LOG = config.get("log")
const DEBUG = "debug"
const ERROR = "error"

//const db = mongoose.connection;
//mongoose.connect(connString, { useNewUrlParser: true });

function logs(text) {
     let time = new Date().toLocaleString({timeZone: 'Europe/Spain'})
     let str = ' '.repeat(25 - time.length)
     text="\""+time+"\"" + str +"  :    "+"\""+text+"\""
     console.log(text);
     // fs.appendFile("log.txt", text, function(err) {
     //    if(err) {
     //        console.log(err);
     //       }
     // });
}

// db.on('error',function(){
// logs("Error al conectarse a Mongo Logs");
// });
//
// db.once('open', function() {
// logs("Conectado a MongoDB Logs");
// });

// definicion de Schema del artículo
// const deviceSchema = new mongoose.Schema({
//   time: {
//     type: String,
//     required: true
//   },
//   ip: {
//     type: String,
//     required: false
//   },
//   request: {
//     type: String,
//     required: true
//   },
// });
//
// let myLogs = mongoose.model('Logs', deviceSchema);

module.exports = {
  log: (text) => {
    switch (LOG) {
      case DEGUG:
        logs(text)
        break;
      case ERROR:
        console.log(test)
        break;
      default:
        console.log(test)
    }
  },


  newLog: (ip, request) => {
       let length =  (20 - ip.length) > 0 ? 20 - ip.length : 1
       let str = ' '.repeat(length)
       logs(ip + str +"  :    " + request + " ")
    // let log = new myLogs(
    //   {
    //     time: new Date().getTime(),
    //     request: request,
    //     ip: ip
    //   });
    // log.save(function(err, result) {
    //   if (err) throw err;
    // });
  },

  //getAll: () => { return myLogs.find() },
}
