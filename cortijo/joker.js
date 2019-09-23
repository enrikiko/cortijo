const request = require('superagent');
const fs = require('fs');
const myLogs = require('./logs');
const myTemperature = require('./temperature');
var dot = false

module.exports={

     switchStatus: async (ip, status, name) => {
       // console.log("http://"+ip+"/"+status);
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
       // console.log(url);
       async function getResponse(url) {
         let response = await request.get(url);
         // console.log(response.statusCode)
         return response.statusCode;
       }
       return await getResponse(url);
     },

    log: (text) => {
       //io.emit('chat message', text);
       let time = new Date().getTime()
       time = dateFormat(time, "dddd, mmmm dS, yyyy, h:MM:ss TT");
       text="\""+time+"\""+":"+"\""+text+"\""
       // if(dot){text=","+text}
       // dot=true
       // var date = Date()
       // text="\"${date}\":\"${text}\""
       console.log(text);
       fs.appendFile("log.txt", text, function(err) {
          if(err) {
              console.log(err);
             }
       });
    },

    newLogRequest: (ip, request)=>{
      var time = new Date().getTime()
      myLogs.newLog(time, ip, request);
    },
    getLogRequest: async()=>{
      let res = await myLogs.getAll();
      return res
    },
    newLogTemperature: (temperature, humidity)=>{
      var time = new Date().getTime()
      myTemperature.newTemperature(time, temperature, humidity);
    },
    getLogTemperature: async()=>{
      let res = await myTemperature.getAll();
      return res
    },
    getStatus: (status) => {
      var status;
      if (status == "true"){ status = true}
      else if (status == "false"){status = false}
      else{ status = null }
      return status;
    }



}
