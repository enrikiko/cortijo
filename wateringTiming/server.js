const request = require('superagent');
async function call() {
     return await request.get("http://192.168.1.50:8000/update/mock/true ");
}
let certain = true
let time
const min = 47
const hour = 11
while(true){
     time = new Date()
     if ( certain & time.getMinutes() == min & time.getHours() == hour){
          certain = false
          call()
          console.log("Is time to watering")
     }else if( !certain & time.getMinutes() != min & time.getHours() != hour){ certain = true}
     console.log(certain)
}
