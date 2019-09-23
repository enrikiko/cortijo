const mongoose = require('mongoose');
let connString = 'mongodb://mongo/requests';
const db = mongoose.connection;
mongoose.connect(connString);

db.on('error',function(){
console.log("Error al conectarse a Mongo Requests");
});

db.once('open', function() {
console.log("Conectado a MongoDB Requests");
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
        console.log(result);
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
