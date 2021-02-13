const config = require('./config');
const DEBUG = "debug"
const ERROR = "error"
const SILENCE = "silence"
//
function logs(text) {
   let time = new Date().toLocaleString({timeZone: 'Europe/Spain'})
   let str = ' '.repeat(25 - time.length)
   text="\""+time+"\"" + str +"  :    "+"\""+text+"\""
   console.log(text);
}
//
function newLogs(ip, request) {
  let length =  (20 - ip.length) > 0 ? 20 - ip.length : 1
  let str = ' '.repeat(length)
  logs(ip + str +"  :    " + request + " ")
}
//
module.exports = {
  error: (text) => {
    newLogs("Error!", text)
  },
  //
  log: (text) => {
    switch (config.get("log")) {
      case DEBUG:
        logs(text)
        break;
      case ERROR:
        break;
      case SILENCE:
        break
      default:
        console.log(text)
    }
  },
  //
  newLog: (ip, request) => {
    switch (config.get("log")) {
      case DEBUG:
        newLogs(ip, request)
        break;
      case SILENCE:
        break
      case ERROR:
        break;
      default:
        console.log(ip)
        console.log(request)
    }

  }
}
