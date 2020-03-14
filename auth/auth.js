const mongoose = require('mongoose');
const conf_map = require('./url');
const mongo_db = conf_map.get("db_url");
//const connString = 'mongodb://192.168.1.50:27017/cortijo';
//mongoose.connect("mongodb://localhost:27017/cortijo");
mongoose.connect(mongo_db, { useNewUrlParser: true });

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
    createUser: async (user, password) => {
        userList = await myAuth.find({user: user})
        if( userList.length > 0 ){return false}
        else{
            let auth = new myAuth({
                user: user,
                password: password
            });
            auth.save(function(err, result) {
                if (err) throw err;
                if(result) {
                    console.log(result);
                }
            });
            return true
        }
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

   isUser: async (name, password) => {
     async function getUser(userName){
        return myAuth.find({user: userName})
     }
     var userList = await getUser(name)
     if (userList.length > 0) {
       if (userList[0].password == password) { return true }
       else { return false }
     }else { return false }
   },

   isValidUser: async(name) => {
   async function getUser(userName){
        return myAuth.find({user: userName})
     }
     var userList = await getUser(name)
     if (userList.length > 0) { return true }
     else { return false }
   }

}
