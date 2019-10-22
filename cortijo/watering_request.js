const mongoose = require('mongoose');
const logs = require('./logs');
let connString = 'mongodb://192.168.1.50:27017/cortijo';
const db = mongoose.connection;
mongoose.connect(connString, { useNewUrlParser: true });

db.on('error',function(){
logs.log("Error al conectarse a Mongo Watering");
});

db.once('open', function() {
logs.log("Conectado a MongoDB Watering");
});

// definicion de esquema del artículo
const requestSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
});

let myRequest = mongoose.model('Watering', requestSchema);

module.exports = {

  newRequest: (name, status) => {
    console.log(name, status);
    let request = new myRequest(
      {
        time: new Date().getTime(),
        name: name,
        status: status
      });
    request.save(function(err, result) {
      if (err) throw err;
      if(result) {
        //logs.log(result);
      }
    });
  },

  getAllRequest: () => { return myRequest.find() }

}
