const mongoose = require('mongoose');
let connString = 'mongodb://user_name:password@localhost:2017/users';
const db = mongoose.connection;
//db.auth("user_name", "password");
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
    type: String,
    required: false
  },
});

// definicion del modelo de dato de nuevos articulos
let myAuth = mongoose.model('Auth', authSchema);

module.exports = {

   getAll: () => { return myAuth.find() },
   getUser: (user) => { return myAuth.find({user: user})},
   createUser: (user, password) => {
        //TODO verify if user exit
     console.log("Creating User...")
     let auth = new myAuth(
       {
         user: user,
         password: password
       });
     auth.save(function(err, result) {
       if (err) throw err;
       if(result) {
         console.log(result);
       }
     });
   },

   removeUser: (user) => {
     console.log("Removing "+user+"...")
     return myAuth.remove({user: user}, function(err, result) {
     if (err) throw err
     if(result){
          console.log(result)
     }
    });
   },

   isUser: async (user, password) => {
     async function getUser(userName){
        return myAuth.find({user: userName})
     }
     var userList = await getUser(user)
     if (userList.length > 0) {
       var device = userList[0]
       var userPassword = device.password
       if (userPassword == password){ return true }
       else{ return false;}
     }else {
       return false
     }
   }


}
