const request = require('superagent');

module.exports={

     catordog: async (req) => {
       console.log(req);
       async function getResponse(req) {
         console.log(req)
         let response = await request.post("http://88.8.65.164/upload").send(req);
         res = {};
         res.code = response.statusCode;
         res.body = response.body
         return res;
       }
       return await getResponse(req);
     },
}
