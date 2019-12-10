const fs = require('fs');
var jwt = require('jsonwebtoken');

const privateKey = fs.readFileSync("privatekey");
const publicKey = fs.readFileSync("privatekey.pub");

module.exports = {
    decodeJwt: async (token) => {
        var payload = await jwt.decode(token)
        console.log(payload)
        return payload
    },
    verifyJwt: async (token) => {
        try {
            var decoded = await jwt.verify(token, privateKey);
            console.log("decoded: "+decoded)
            return decoded
        } catch(err) {
             console.log(err.message)
             return {user:"Invalid JWT"}
        }
    },
    signAuthJwt: async (user, password) => {
        var generatedJWT = await jwt.sign({user:user}, privateKey, {expiresIn: "1h"})
        console.log(generatedJWT)
        return generatedJWT
    }
}
