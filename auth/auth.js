const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
let connString = 'mongodb://192.168.1.50:27017/cortijo';
const db = mongoose.connection;

const privateKey = '-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA0zECulGc1PZmES375qUwzx4yHe5dAd+cGgOewfWVZgyoiGEK
WE6CeGX5fk6kPh8xojZNROLb9psQ6+hslbVmT0VWz25OKkOGCXlinAfQeM5cyd45
PbGLguMRP2NfKg0j3yVAPomW1OwfbXrtGgmb62L7oiTWMrmh/xie8VZXhqerF0IQ
GUNkH9yVcFAtXMorR2CXE6LjYNa9BOaPSMRzGFWY0jFGNqaESa737eVjTBnbLcsJ
YhnM8DwaLoMOUZkf51wLxWgvS+KrIKUAuKCLBF6pTTak8SRNlsf100K/R6tUl7KI
p2U+1dwsJLmWOZ5zS5ssfpbmTNFcPM9DEcAYAQIDAQABAoIBAQCvmwsnngEIW7HX
CyNwT19ceUE2/iK8EhEc2HHD2c7WQiRI8lfFwdJfBnwEeKO9O/braLerVe+NCLdz
UZooieN+equKY6//GJJ1gkdqclz4dq9U88Eo+V6GAQUwbhKNRsvTGohm98VBWu1u
/U313pOVkIKn+nVZTF3VXcWb6y1wOqqDyIsVTL/VBBsgLKDQJdZIJnaJiGcFYdr0
rXlf5qWjKdWnGnKcc60WCSVrA4mdhQu8venqT9fZLICs6SUf/2HAzwI3NNsT5+58
ZOG9wx+lTJ8XOUerh4eJ0Zk0gnkDJUML5xJccchiX0ns7UH9MzTYH1k40Fs6MjoI
JFVZVGrZAoGBAP8OZRUjH9rzT8IJFLVtfmtUJXgZzzDWOAQpbh37gLDI1TDb+Ata
lnbGekfUHZBGP8sFeKvY5gZdQowyeeU8QUsygPWoGBK6/DH/3igoHPc2rJX9IuWV
m8AyIsFQRofAjeMi8Lp8aAxMVl1I3BEb72LqKo7aN3gpyu6HSHdFnkvDAoGBANP5
EHkgGZvc4rzj5xn0/vVHeicCU1LeKTODcRXsgAFdZmoLD/dSAOGUk7nrFI39Ks/R
YvRtVhP4P2IGjNuCLbPXCuU6gluIAeMxUNszncZeRdPkybAOzcrXzQ5f7DC8kwSY
EJ0iirMYcvMnG8oMfmnp7YhN14h4SserZ+WGIITrAoGAefj7VCFpAX8sHEHVenHz
bAZgqM/G6rb3MN5TP9lfkKtqcKQxOdTHceO25JTG0pEVvtROAfiHAHIm+f7Fll+7
ZeewDkqlwIdVRd/z8MZGG980p8HXp21lf4M6ZbIrGI54DDBQaQ5Hf+IdxxypyTDP
yUDsu0YWEswBtRJTEF7ltZsCgYBttftQtcyLX0f7e/mg9a0ARn5yskFuIo4wm1ds
gXu/ORhIynD5EPhjyQKst39r/hyqczVETVLAAzzK/5joA/ijnCmHe0D9HufbLysq
SQzgHusFQOUiuobI9eisB/m3P+LX/dybd8VR7NWSBCvd55mGOA04/xEPETOjJJQh
t8odAQKBgE28ck9rUWBIoFbOvXuH5E8o+7pVmiSi8IHou9k0uepGZBfsC487i4qe
wcBiSLFSqxL+7ojJRUwANh7dx2H92PVUJc73W5kCm2rtQH2tYNJz/DikkGGYWzCq
jvE2r81lCyXoNNDecxtQ6osrmDM9HwV+0B6PU1168dXm/inUe1tL
-----END RSA PRIVATE KEY-----'

const publicKey = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDTMQK6UZzU9mYRLfvmpTDPHjId7l0B35waA57B9ZVmDKiIYQpYToJ4Zfl+TqQ+HzGiNk1E4tv2mxDr6GyVtWZPRVbPbk4qQ4YJeWKcB9B4zlzJ3jk9sYuC4xE/Y18qDSPfJUA+iZbU7B9teu0aCZvrYvuiJNYyuaH/GJ7xVleGp6sXQhAZQ2Qf3JVwUC1cyitHYJcTouNg1r0E5o9IxHMYVZjSMUY2poRJrvft5WNMGdstywliGczwPBougw5RmR/nXAvFaC9L4qsgpQC4oIsEXqlNNqTxJE2Wx/XTQr9Hq1SXsoinZT7V3CwkuZY5nnNLmyx+luZM0Vw8z0MRwBgB root@9e82a1f9d8b6'
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
   signJwt: async (val) => { return jwt.sign(val, privateKey) },
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
