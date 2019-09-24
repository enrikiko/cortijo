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

    readLog: () => {
        var jsonString = '{'+fs.readFileSync("log.txt", {encoding: 'ASCII'})+'}'
        return JSON.parse(jsonString)
     },

     auth: async (user, password) => {
       const url = "http://192.168.1.50:8010/user/"+user+"/"+password
       async function getResponse(url) {
         let response = await request.get(url);
         return response.statusCode;
       }
       return await getResponse(url);
     },

    newLogRequest: (ip, request)=>{
      var time = new Date().getTime()
      myLogs.newLog(time, ip, request);
    },
    getLogRequest: async()=>{
      let res = await myLogs.getAll();
      return res
    },
    // newLogTemperature: (temperature, humidity)=>{
    //   var time = new Date().getTime()
    //   myTemperature.newTemperature(time, temperature, humidity);
    // },
    getLogTemperature: async()=>{
      return await myTemperature.getAll();
    },
    getStatus: (status) => {
      if (status == "true"){ return true}
      else if (status == "false"){return false}
      else{ return null }
    }



}
