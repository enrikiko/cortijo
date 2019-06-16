const request = require('superagent');
const fs = require('fs');

module.exports={

     switchStatus: async (ip, status) => {
       console.log("http://"+ip+"/"+status);
       async function getResponse(ip, status, ) {
         let response = await request.get("http://"+ip+"/status/"+status);
         res = {};
         res.code = response.statusCode;
         res.body = response.body
         return res;
       }
       return await getResponse(ip, status);
     },

    readLog: () => {
        return fs.readFileSync("log.txt", {encoding: 'ASCII'})
     },

    execute: (msg) => {
       console.log(msg)
       exec(msg, (err, stdout) => {
         if (err) {
           console.log(err)
         }
         if (stdout) {
           console.log(stdout);
         }
       });
     },

    log: (text) => {
       //io.emit('chat message', text);
       console.log(text);
       text=Date()+"\n"+text+"\n\n"
       fs.appendFile("log.txt", text, function(err) {
          if(err) {
              console.log(err);
             }
      });
    },
    getStatus: (status) => {
      var status;
      if (status == "true"){ status = true}
      else if (status == "false"){status = false}
      else{ status = null }
      return status;
    }



}
