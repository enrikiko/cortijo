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

   isUser: async (user, password) => {
     async function getUser(userName){
        return myAuth.find({user: userName})
     }
     var list = await getUser(user)
     if (list.length > 0) {
       var device = list[0]
       var userPassword = device.password
       if (userPassword == password){ return true }
       else{ return false;}
     }else {
       return false
     }
   },


}
