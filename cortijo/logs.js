const mongoose = require('mongoose');
let connString = 'mongodb://192.168.1.50:27017/cortijo';
const fs = require('fs');
const config = fs.readFileSync('config.json');
const DEBUG = "debug"
const yaml = require('js-yaml')
const yaml_file = fs.readFileSync('yaml_file.yaml');
const yaml_data = yaml.safeLoad(yaml_file);

const db = mongoose.connection;
mongoose.connect(connString, { useNewUrlParser: true });

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
  console.log(config.log)
  console.log(yaml_data.log)
    if( config.log == DEBUG ){
        logs(text)
    }
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
