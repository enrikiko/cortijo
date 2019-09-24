const request = require('superagent');
async function call() {
     return await request.get("http://192.168.1.50:8000/update/mock/true ");
}
let certain = true
let time
while(true){
     time = new Date()
     if ( certain && time.getMinutes() == 43 && time.getHours() == 11){
          certain = false
          call()
          console.log("Is time to watering")
     }else if( time.getMinutes() != 35 && time.getHours() != 11){ certain = true}
     console.log(certain)
}
