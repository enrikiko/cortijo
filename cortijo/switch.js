const logs = require('./logs');
const request = require('./request');
const myDevice = require('./devices');
const myDevicesChanges = require('./devicesChanges');

let timeOutMap={}

async function changeBackFalse(device) {
  //Change back to false
  tenant = device.tenant
  name = device.name
  try {
      var responseBack = await request.switchStatus(tenant, false, name) //Change device status
      if (responseBack.code == 200) {
          logs.log("Changed back automatically due to timeout " + name + " to false")
          myDevicesChanges.newRequest(tenant, name, false, "node.js", null)
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
  changeStatusToFalse: async (tenant, name, res, user) => {
    var id = await myDevice.getIdByName(tenant, name) //Get ID of the device //
    if ( !id ) {
        logs.error({"Request": "Incorrect", "Device": "Not found"});
        if(res!=null){
          res.status(404).json({"Request": "Incorrect", "Device": "Not found"})
        }
    }else {
        logs.log("Change status of "+name+" to false");
        try {
            var response = await request.switchStatus(tenant, false, name) //Change device status //TODO make sure this is ejecute
            if (response.code == 200) {
              clearTimeout(timeOutMap[name])
              await myDevicesChanges.newRequest(tenant, name, false, user, null)
              request.telegramAlert(name, null, user);
              if(res!=null){  //TODO is this nessesary?
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
  changeStatusToTrue: async (tenant, name, lapse, res, user) => {
    var device = await myDevice.getDeviceByName(tenant, name) //Get ID of the device //
    console.log(`Change statusof ${name} to true`);
    console.log(device[0].id);
    if ( !device[0].id ) {
      logs.error({"Request": "Incorrect", "Device": "Not found"});
      if(res!=null){
        res.status(404).json({"Request": "Incorrect", "Device": "Not found"})
      }
    }else {
      logs.log("Change status of "+name+" to true");
        try {
              var response = await request.switchStatus(tenant, true, name) //Change device status
              if (response.code == 200) {
                await myDevicesChanges.newRequest(tenant, name, true, user, lapse)
                timeOutMap[tenant+'_'+name] = setTimeout(changeBackFalse, lapse, {"tenant":tenant, "name":name});
                request.telegramAlert(name, lapse, user);
                if(res!=null){  //TODO is this nessesary?
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
