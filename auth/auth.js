const mongoose = require('mongoose');
let connString = 'mongodb://mongo/users';
const db = mongoose.connection;
//mongoose.connect("mongodb://localhost:27017/users");
mongoose.connect(connString);

db.on('error',function(){
console.log("Error al conectarse a Mongo");
});

db.once('open', function() {
console.log("Conectado a MongoDB");
});

// definicion de esquema del artículo
const authSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  password: {
    type: Boolean,
    required: false
  },
});

// definicion del modelo de dato de nuevos articulos
let myAuth = mongoose.model('Auth', authSchema);

module.exports = {

   createUser: (user, password) => {
     let user = new myAuth(
       {
         user: user,
         password: password
       });
     user.save(function(err, result) {
       if (err) throw err;
       if(result) {
         console.log(result);
       }
     });
   },

   is: async (deviceNane) => {
     async function getList(name){
        return myDevice.find({name: name})
     }
     var list = await getList(deviceNane)
     if (list.length > 0) {
       var device = list[0]
       var id = device._id
       return id
     }else {
       return null
     }
   },


}
