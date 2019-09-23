const request = require('superagent');
const joker = require('./joker');

module.exports={

     catordog: async (req) => {
       joker.log(req);
       async function getResponse(req) {
         joker.log(req)
         let response = await request.get("http://88.8.65.164:8200/liveness");
         res = {};
         res.code = response.statusCode;
         res.body = response.body
         return res;
       }
       return await getResponse(req);
     },
}
