const logs = require('./logs');
const joker = require('./joker');
const myDevice = require('./devices');
const myDevicesChanges = require('./devicesChanges');

let timeOutMap={}

async function changeBackFalse(name) {
  //Change back to false
  try {
      var responseBack = await joker.switchStatus(false, name) //Change device status
      if (responseBack.code == 200) {
          logs.log("Changed back automatically due to timeout " + name + " to false")
          myDevicesChanges.newRequest(name, null, false, "timeout")
      }
      else {
          logs.error("Error changing back " + name + " to false")
  }
  } catch (e) {
      logs.error(e)
      var responseBack = {}
      responseBack.code = 404
  }
}

module.exports = {
  changeStatusToFalse: async (name, res, ip) => {
    var id = await myDevice.getIdByName(name) //Get ID of the device //
    if ( !id ) {
        logs.error({"Request": "Incorrect", "Device": "Not found"});
        res.status(404).json({"Request": "Incorrect", "Device": "Not found"})
    }else {
        //logs.log(JSON.stringify(isUpdating))
        logs.log("Change status of "+name+" to false");
        try {
            var response = await joker.switchStatus(false, name) //Change device status //TODO make sure this is ejecute
            //joker.switchAlert( name, ip )
            if (response.code == 200) {
              clearTimeout(timeOutMap[name])
              //console.log("changeStatusToFalse");
              await myDevicesChanges.newRequest(name, null, false, ip)
              //console.log("changeStatusToFalse After");
              if(res!=null){  //TODO is this nessesary?
              //joker.switchAlertLapse(name, lapse, ip);
                res.status(response.code).send(response)
              }
            }else {
               if(res!=null){
                 return res.status(200).send(response)
               }
            }
        } catch (e) {
            logs.error(e)
            var response = {}
            response.code = 404
        }
    }
  },
  changeStatusToTrue: async (name, lapse, res, ip) => {
    var id = await myDevice.getDeviceByName(name) //Get ID of the device //
    if ( !id ) {
      logs.error({"Request": "Incorrect", "Device": "Not found"});
      return res.status(404).json({"Request": "Incorrect", "Device": "Not found"})
    }else {
      logs.log("Change status of "+name+" to true");
        try {
              var response = await joker.switchStatus(true, name) //Change device status
              if (response.code == 200) {
                await myDevicesChanges.newRequest(name, lapse, true, ip)
                timeOutMap[name] = setTimeout(changeBackFalse, lapse, name);
                if(res!=null){  //TODO is this nessesary?
                //joker.switchAlertLapse(name, lapse, ip);
                  res.status(response.code).send(response)
                }
              }else {
                 if(res!=null){
                   return res.status(200).send(response)
                 }
              }
        } catch (e) {
             logs.error(e)
             var response = {}
             response.code = 404
        }
      }
  }
}
