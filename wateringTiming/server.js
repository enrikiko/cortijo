const request = require('superagent');
async function call() {
     return await request.get("http://192.168.1.50:8000/update/Watering/true ");
}
let certain
while(true){
     if ( new Date().getMinutes() == 30 & certain){
          certain = false
          call()
          console.log("Is time to watering")
     }else { certain = true}
}
