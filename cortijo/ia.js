const request = require('superagent');
const logs = require('./logs');

module.exports={

     catordog: async (req) => {
       logs.log(req);
       async function getResponse(req) {
         logs.log(req)
         let response = await request.get("http://88.8.65.164:8200/liveness");
         res = {};
         res.code = response.statusCode;
         res.body = response.body
         return res;
       }
       return await getResponse(req);
     },
}
