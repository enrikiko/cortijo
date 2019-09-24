const request = require('superagent');
async function request() {
     return await request.get("http://192.168.1.50:8000/update/Watering/true ");
}
let certain
while(true){
     if ( new Date().getMinutes() == 25 & certain){
          certain = false
          request()
     }else { certain = true}
}
