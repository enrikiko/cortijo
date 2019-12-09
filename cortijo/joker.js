const request = require('superagent');
const myTemperature = require('./temperature');
const watering = require('./watering');
const myDevice = require('./devices');
const logs = require('./logs');

module.exports={

     switchStatus: async (status, name) => {
       async function getResponse() {
        try{
            ip = await myDevice.getIpByName(name)
            let response = await request.get("http://"+ip+"/"+name+"/status/"+status).timeout({response: 10000});
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
            let response = await request.get("http://"+ip+"/"+name+"/status").timeout({response: 10000});
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
        const url = "http://192.168.1.50:8010/auth/jwt"
        const body = {"jwt":jwt}
        console.log(getUserByJWT)
        logs.logs(body)
        async function getResponse(url) {
            let response = await request.get(url, body);
            return response;
        }
       return await getResponse(url);
     },

    // newLogRequest: (ip, request)=>{
    //   var time = new Date().getTime()
    //   myLogs.newLog(time, ip, request);
    // },
    // getLogRequest: async()=>{
    //   let res = await myLogs.getAll();
    //   return res
    // },
    // newLogTemperature: (temperature, humidity)=>{
    //   var time = new Date().getTime()
    //   myTemperature.newTemperature(time, temperature, humidity);
    // },
    // getLogTemperature: async()=>{
    //   return await myTemperature.getAll();
    // },
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
