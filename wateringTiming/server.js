const request = require('superagent');
async function call() {
     return await request.get("http://192.168.1.50:8000/update/mock/true ");
}
let certain = true
while(true){
     if ( certain && new Date().getMinutes() == 35 && new Date().getHours() == 11){
          certain = false
          call()
          console.log("Is time to watering")
     }else { certain = true}
}
