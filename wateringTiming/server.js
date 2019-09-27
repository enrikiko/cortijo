const request = require('superagent');
async function call() {
     console.log("calling...")
     return await request.get("http://192.168.1.50:8000/update/mock/true");
}
let certain = true
let time
const min = 55
const hour = 18
while(true){
     time = new Date()
     if ( certain & time.getMinutes() == min & time.getHours() == hour){
          certain = false
          console.log(time)
          console.log("Is time to watering")
          console.log(call())
     }else if( !certain & (time.getMinutes() != min | time.getHours() != hour)){
          certain = true
     }
}
