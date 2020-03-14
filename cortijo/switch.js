const logs = require('./logs');
const joker = require('./joker');
const myDevice = require('./devices');
module.exports = {
  changeStatusToFalse: async (name, res) => {
    var id = await myDevice.getIdByName(name) //Get ID of the device //

    if ( !id ) {
        res.status(404).json({"Request": "Incorrect", "Device": "Not found"})
    }else {
        //logs.log(JSON.stringify(isUpdating))
        logs.log("Change status of "+name+" to false");
        try {
            var response = await joker.switchStatus(false, name) //Change device status
            joker.switchAlert( name )
            if (response.code == 200) {
                res.status(response.code).send(response)
            }else {
                res.status(response.code).send(response)
            }
        } catch (e) {
            logs.error(e)
            var response = {}
            response.code = 404
        }
    }
  },
  changeStatusToTrue: async (name, lapse, res) => {
    var id = await myDevice.getDeviceByName(name) //Get ID of the device //
    if ( !id ) {
      return res.status(404).json({"Request": "Incorrect", "Device": "Not found"})
    }else {
      //logs.log(JSON.stringify(isUpdating))
      logs.log("Change status of "+name+" to true");
        try {
              response = await joker.switchStatus(true, name) //Change device status
              if (response.code == 200) {
                if(res!=null){
                res.status(response.code).send(response)
                }
                setTimeout(async function(){  //Change back to false
                        try {
                            var responseBack = await joker.switchStatus(false, name) //Change device status
                            if (responseBack.code == 200) {
                                logs.log("Changed back automatically due to timeout " + name + " to false")
                            }
                            else {
                                logs.error("Error changing back " + name + " to false")
                        }
                        } catch (e) {
                            console.log(e)
                            var responseBack = {}
                            responseBack.code = 404
                        }
                    }, lapse);
              }else {
                 if(res!=null){
                   return res.status(200).send(response)
                 }
              }
        } catch (e) {
             console.log(e)
             var response = {}
             response.code = 404
        }
      }
  }
}
