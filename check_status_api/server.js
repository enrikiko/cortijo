

const request = require('superagent');
const mongoose = require('mongoose');
let connString = 'mongodb://192.168.1.50:27017/cortijo';
const db = mongoose.connection;
mongoose.connect(connString, { useNewUrlParser: true });


db.on('error',function(){
console.log("Error al conectarse a Mongo");
});


db.once('open', function() {
console.log("Conectado a MongoDB");
});


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

let myDevice = mongoose.model('User', deviceSchema);

mongoFunction = {

   getDevice: () => { return myDevice.find() },

   getDeviceByName: (Name) => { return myDevice.find({name: Name})},

   getDeviceById: (id) => { return myDevice.findById(id)},

   newDevice: (name, status, ip) => {
     let device = new myDevice(
       {
         name: name,
         status: status,
         ip: ip
       });
     device.save(function(err, result) {
       if (err) throw err;
       if(result) {
         console.log(result);
       }
     });
   },

   getIdbyName: async (deviceNane) => {
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

   getIpbyName: async (deviceNane) => {
     async function getList(name){
        return myDevice.find({name: name})
     }
     var list = await getList(deviceNane)
     if (list.length > 1) {
       return "The Database is corupeted";
     } else if (list.length > 0) {
       return list[0].ip
     }else {
       return null
     }
   },

   updateDevice: (id, status) => {
    return myDevice.findById(id, function(err, result) {
       if (err) throw err
       if(result){
         result.status = status
         result.save()
         console.log(result)
       }
     });
   },

   setStatus: (id, status) => {
    return myDevice.findById(id, function(err, result) {
       if (err) throw err
       if(result){
         result.status = status
         result.check = true
         result.save()
         console.log(result)
       }
     });
   },

   updateDeviceIp: (id, ip) => {
     var device = myDevice.findById(id, function(err, result) {
       if (err) throw err
       if(result){
         result.ip = ip
         result.save()
         console.log(result)
       }
     });
     return device.ip;
   },

   removeDeviceByName: (deviceName) => {
    return myDevice.remove({name: deviceName}, function(err, result) {
      if (err) throw err
      if(result){
        console.log(result)
        }
      });
    }

}


// const error = {"error": 500}
//
// app.get("/all", async function(req, res) { //OK
//   try{
//     var response = await myDevice.getDevice();
//     res.status(200).json(response)
//   }catch(response){
//     res.status(500).json(error)
//   }
//   })
//
// app.listen(3000, function () {
//     console.log('Servidor activo en http://localhost:3000');
//   })
 // let listDevice=[{
 //     "_id": "5cf8327d9e1de200090b4bea",
 //     "name": "mock",
 //     "status": false,
 //     "ip": "88.8.67.178:8001",
 //     "__v": 0
 //   }]

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

async function checkStatus() {

  try {
    const list = await mongoFunction.getDevice();
    //console.log("list: "+list[0].ip);
    return loopList(list)
  } catch (e) {
    console.log();
  } finally {
    console.log("end");
  }

}



async function loopList(listDevice) {
  l=[]
  for (elem in listDevice){
      console.log("http://"+listDevice[elem].ip+"/info");
      let res = await request.get("http://"+listDevice[elem].ip+"/info");
      console.log(res.body);
      let save = await mongoFunction.setStatus(listDevice[elem]._id, res.body.status)
      console.log(save);
      l.push(save)
    }
    return l
}


// var listDevice = getList()
// console.log("listDevice: "listDevice);
// for (elem in listDevice){
//     //console.log("http://"+listDevice[elem].ip+"/info");
//     let res = await request.get("http://"+listDevice[elem].ip+"/info");
//     //console.log(res.body);
//     let save = mongoFunction.setStatus(listDevice[elem]._id, res.body.status)
//     //console.log(save);
//   }

while (true) {
  sleep(2000)
  checkStatus()
}
