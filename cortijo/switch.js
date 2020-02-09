const logs = require('./logs');
const joker = require('./joker');
const myDevice = require('./devices');
module.exports = {
  changeStatus: async (name, lapse, res) => {
    var id = await myDevice.getDeviceByName(name) //Get ID of the device //
    if ( !id ) {
      return res.status(404).json({"Request": "Incorrect", "Device": "Not found"})
    }else {
      //logs.log(JSON.stringify(isUpdating))
      logs.log("Change status of "+name+" to true");
        try {
              //joker.switchAlertLapse( name, lapse )
              response = await joker.switchStatus(true, name) //Change device status
              if (response.code == 200) {
                //logs.log(res)
                if(res!=null){
                  return res.status(response.code).send(response)
                }
                  setTimeout(async function(){  //Change back to false
                      try {

                          var responseBack = await joker.switchStatus(false, name) //Change device status
                          if (responseBack.code == 200) {
                              logs.log("Changed back automatically due to timeout " + name + " to false")
                          }
                          else {
                              logs.log("Error changing back " + name + " to false")
                      }
                      } catch (e) {
                          console.log(e)
                          var responseBack = {}
                          responseBack.code = 404
                      }
                  }, lapse);
              }else {
                 //logs.log(res)
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
