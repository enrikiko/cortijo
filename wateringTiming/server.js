const request = require('superagent');
async function call() {
     console.log("calling...")
     return await request.get("http://192.168.1.50:8000/update/mock/true");
     console.log("calling")
}
let certain = true
let time
const min = 10
const hour = 17
while(true){
     time = new Date()
     if ( certain & time.getMinutes() == min & time.getHours() == hour){
          certain = false
          console.log(await call())
          console.log(certain)
          // console.log(res)
          console.log("Is time to watering")
     }else if( !certain & (time.getMinutes() != min | time.getHours() != hour)){
          certain = true
          console.log(certain)
     }
}
