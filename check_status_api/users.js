const mongoose = require('mongoose');
let connString = 'mongodb://mongo/users';
const db = mongoose.connection;
mongoose.connect(connString);

db.on('error',function(){
console.log("Error al conectarse a Mongo");
});

db.once('open', function() {
console.log("Conectado a MongoDB");
});
// mongoose.connect('mongodb://192.168.1.50/users',{ useNewUrlParser: true }).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

// definicion de esquema del artículo
const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: false
  },
  ip: {
    type: String,
    required: true
  },
  check: {
    type: Boolean,
    required: false
  },
});
