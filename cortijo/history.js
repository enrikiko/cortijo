// const request = require('superagent');
// const fs = require('fs');
const myLogs = require('./logs');

module.exports = {

history: async () => {
 try{
   var response = await myLogs.getAll();
   // console.log(response)
   return response
   }catch(response){ console.log(response) }
 }
 
}
