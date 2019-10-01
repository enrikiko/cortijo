const request = require('superagent');
async function on() {
  http.get({
    hostname: '192.168.1.50',
    port: 8000,
    path: '/update/mock/true',
    agent: false  // Create a new agent just for this one request
  }, (res) => {
    // Do stuff with response
    console.log(res)
  });
}
async function off() {
     console.log("calling...")
     let res = await request.get("http://192.168.1.50:8000/update/mock/false");
     return res
}
async function start() {
     console.log("starting...")
     let res = await on();
     console.log(res)
     return res
}
async function stop() {
     console.log("stopping...")
     let res = await off();
     console.log(res)
     return res
}
let certain = true
let time
const min = 9
const hour = 9
while(true){
     time = new Date()
     if ( certain & time.getMinutes() == min & time.getHours() == hour){
          certain = false
          console.log(time)
          console.log("Is time to watering")
          on()
     }else if( !certain & (time.getMinutes() != min | time.getHours() != hour)){
          certain = true
          console.log(time)
          console.log("Is time to stop watering")
          stop()
     }
}
