const mongoose = require('mongoose');
const fs = require('fs');
var jwt = require('jsonwebtoken');
let connString = 'mongodb://192.168.1.50:27017/cortijo';
const db = mongoose.connection;


const privateKey = fs.readFileSync("private_key");
const publicKey = fs.readFileSync("public_key");

//mongoose.connect("mongodb://localhost:27017/cortijo");
mongoose.connect(connString, { useNewUrlParser: true });

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
   decodeJwt: async (token) => { return await jwt.decode(token) },
   verifyJwt: (token) => {
     try {
       var decoded = jwt.verify(token, privateKey);
     } catch(err) {
          console.log(err)
     }
     return decoded
     },
   signJwt: async (val) => { return jwt.sign(val, privateKey, {expiresIn: 604800} ) },
   createUser: (user, password) => {
        //TODO verify if user exit
     console.log("user:", myAuth.find({user: user}) );
     console.log("user_is_null:", myAuth.find({user: user}) == null );
     console.log("user_is_[]:", myAuth.find({user: user}) == [] );
     console.log("Creating User...");
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
