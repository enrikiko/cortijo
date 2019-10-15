const mongoose = require('mongoose');
const logs = require('./logs');
let connString = 'mongodb://user_name:password@192.168.1.50:27017/users';
const db = mongoose.connection;
mongoose.connect(connString, { useNewUrlParser: true });

db.on('error',function(){
logs.log("Error al conectarse a Mongo Requests");
});

db.once('open', function() {
logs.log("Conectado a MongoDB Requests");
});

// definicion de esquema del artículo
const requestSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
});

let myRequest = mongoose.model('Request', requestSchema);

module.exports = {

  newRequest: (ip, url) => {
    let request = new myRequest(
      {
        time: new Date().getTime(),
        ip: ip,
        url: url
      });
    request.save(function(err, result) {
      if (err) throw err;
      if(result) {
        //logs.log(result);
      }
    });
  },

  getAllRequest: () => { return myRequest.find() },

  getAllIp: async () => {
       let ipList = []
       const allRequest = await myRequest.find()
       allRequest.forEach(function (item, index) {
            const ip = item.ip
            if (!ipList.includes(ip)){ipList.push(ip)}
       })
       return ipList
  },

}
