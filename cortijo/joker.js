const request = require('superagent');
const myLogs = require('./logs');
const myTemperature = require('./temperature');
var dot = false

module.exports={

     switchStatus: async (ip, status, name) => {
       async function getResponse(ip, status, ) {
         let response = await request.get("http://"+ip+"/"+name+"/status/"+status);
         res = {};
         res.code = response.statusCode;
         res.body = response.body
         return res;
       }
       return await getResponse(ip, status);
     },

    // readLog: () => {
    //     var jsonString = '{'+fs.readFileSync("log.txt", {encoding: 'ASCII'})+'}'
    //     return JSON.parse(jsonString)
    //  },

     auth: async (user, password) => {
       const url = "http://192.168.1.50:8010/auth/jwt/"+user+"/"+password
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

    alert: async (text) => {
      const url = "https://us-central1-afrodita-2e204.cloudfunctions.net/triggerPushNotification?token=f3KPUkNC_7k:APA91bEWbIf-8Ew4PshzW4wT6fImKfQ89OO4X1UKpin7eSQaIUdq540oNM1qkkIEyqFNJVFySROTfqS8ywWPpOPXmRhT1HLPezmcsCDseJP78sDga2YRJ88is-wjvghLYMpSp_PadXCv&tittle=" + text
      async function getResponse(url) {
        let response = await request.get(url);
        console.log(url)
        console.log(response)
        return response;
      }
      return await getResponse(url);
    }



}
