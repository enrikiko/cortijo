const fs = require('fs');
var jwt = require('jsonwebtoken');
const conf_map = require('./url');
const mongo_db = conf_map.get("db_url");
const privateKey = conf_map.get("privatekey");
const publicKey = conf_map.get("publickey");

module.exports = {
    decodeJwt: async (token) => {
        var payload = await jwt.decode(token)
        //console.log(payload)
        return payload
    },
    verifyJwt: async (token) => {
        try {
            var decoded = await jwt.verify(token, privateKey);
            return decoded
        } catch(err) {
             console.log(err.message)
             return {user:"Invalid JWT"}
        }
    },
    signAuthJwt: async (user, password) => {
        var generatedJWT = await jwt.sign({user:user}, publicKey, {expiresIn: "1y"})
        return generatedJWT
    }
}
