// const request = require('superagent');
// const fs = require('fs');
const myLogs = require('./logs');
const myTemperature = require('./temperature');

module.exports = {

temperature: async () => {
 try{
   var response = await myLogs.getAll();
   // console.log(response)
   return response
   }catch(response){ console.log(response) }
 },

humidity: async () => {
  try{
    var response = await myTemperature.getAll();
    return response
    }catch(response){ console.log(response) }
  }
}
