const request = require('superagent');
const req = require('request');
const fs = require('fs');
const yaml = require('js-yaml')
const myTemperature = require('./temperature');
const watering = require('./watering');
const myDevice = require('./devices');
const logs = require('./logs');
// Get config
const config_file = fs.readFileSync('config.yaml');
const config = yaml.safeLoad(config_file);
SWITCH_STATUS_TIMEOUT = config.switch_status_timeout
GET_DEVICE_STATUS_TIMEOUT = config.get_device_status_timeout

module.exports={

     switchStatus: async (status, name) => {
       async function getResponse() {
        try{
            ip = await myDevice.getIpByName(name)
            let response = await request.get("http://"+ip+"/"+name+"/status/"+status).timeout({response: SWITCH_STATUS_TIMEOUT});
            if(response.statusCode==200){
                id = await myDevice.getIdByName(name)
                await myDevice.updateDevice(id, status)
                await myDevice.checkDeviceByName(name)
                res = {};
                res.code = response.statusCode;
                res.body = response.body
                return res;
            }
        }catch (e) {
            let response = await myDevice.blockDeviceByName(name)
            logs.log(e)
            res = {};
            res.code = 400;
            res.body = response
            return res
            }
       }
       return await getResponse();
     },

     switchAlertLapse: async ( name, lapse ) => {
        ip = myDevice.getIdByName(name)
        text = name+" has changed to true during "+lapse+" miliseconds"
        const url = "https://us-central1-afrodita-2e204.cloudfunctions.net/triggerPushNotification?token=dPM2s9vYj4o:APA91bG3LiZsdvj7EPqBlTHKNXCiDbpWDdxKhONAO_qpIf_8uomgVW5QFtxM2AIX0kJPPt3RBzPJVeMNMgkCTtfkUoJFAHYtPBROh6bupxDkxW647z7J4A8Y3690q7OV6_lkYIvt7dlA&title=" + text
        await request.get(url);
        watering.newRequest(name, lapse, true)
     },
//
     switchAlert: async ( name ) => {
        ip = myDevice.getIdByName(name)
        text = name+" has changed to false"
        const url = "https://us-central1-afrodita-2e204.cloudfunctions.net/triggerPushNotification?token=dPM2s9vYj4o:APA91bG3LiZsdvj7EPqBlTHKNXCiDbpWDdxKhONAO_qpIf_8uomgVW5QFtxM2AIX0kJPPt3RBzPJVeMNMgkCTtfkUoJFAHYtPBROh6bupxDkxW647z7J4A8Y3690q7OV6_lkYIvt7dlA&title=" + text
        await request.get(url);
        watering.newRequest(name, null, false)
     },
//
     getDeviceStatus: async (name) => {
        async function status() {
            ip= await myDevice.getIpByName(name)
            let response = await request.get("http://"+ip+"/"+name+"/status").timeout({response: GET_DEVICE_STATUS_TIMEOUT});
            return response["body"];
        }
     return await status();
     },
//
    // readLog: () => {
    //     var jsonString = '{'+fs.readFileSync("log.txt", {encoding: 'ASCII'})+'}'
    //     return JSON.parse(jsonString)
    //  },
//
     auth: async (user, password) => {
       const url = "http://192.168.1.50:8010/auth/"+user+"/"+password
       async function getResponse(url) {
         let response = await request.get(url);
         return response.body.jwt;
       }
       return await getResponse(url);
     },

     verifyJwt: async (jwt) => {
       const url = "http://192.168.1.50:8010/auth/jwt/"+jwt
       async function getResponse(url) {
         let response = await request.get(url);
         return response.jwt;
       }
       return await getResponse(url);
     },

     getUserByJWT: async (jwt) => {
        const url = "http://192.168.1.50:8010/jwt/"+jwt
        async function getResponse(url) {
            let response = await request.get(url);
            if(response.status==200){return response}
            else{ throw false }
        }
       return await getResponse(url);
     },

    getStatus: (status) => {
      if (status == "true"){ return true}
      else if (status == "false"){return false}
      else{ return null }
    },

    // alert: async (text) => {
    //   const url = "https://us-central1-afrodita-2e204.cloudfunctions.net/triggerPushNotification?token=dPM2s9vYj4o:APA91bG3LiZsdvj7EPqBlTHKNXCiDbpWDdxKhONAO_qpIf_8uomgVW5QFtxM2AIX0kJPPt3RBzPJVeMNMgkCTtfkUoJFAHYtPBROh6bupxDkxW647z7J4A8Y3690q7OV6_lkYIvt7dlA&title=" + text
    //   async function getResponse(url) {
    //     let response = await request.get(url);
    //     //console.log(url)
    //     //console.log(response)
    //     return response;
    //   }
    //   return await getResponse(url);
    // }
}
