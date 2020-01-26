const config = require('./config');
const LOG = config.get("log")
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
  log: (text) => {
    switch (LOG) {
      case DEBUG:
        logs(text)
        break;
      case ERROR:
        console.log(test)
        break;
      case SILENCE:
        break
      default:
        console.log(test)
    }
  },
  //
  newLog: (ip, request) => {
    switch (LOG) {
      case DEBUG:
        newLogs(ip, request)
        break;
      case SILENCE:
        break
      case ERROR:
        console.log(request)
        break;
      default:
        console.log(request)

    }

  }
}
