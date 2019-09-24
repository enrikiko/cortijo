const request = require('superagent');
async function call() {
     return await request.get("http://192.168.1.50:8000/update/Watering/true ");
}
let certain
while(true){
     if ( new Date().getMinutes() == 27 & certain){
          certain = false
          call()
     }else { certain = true}
}
