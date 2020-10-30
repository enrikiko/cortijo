const superagent = require('superagent');
const req = require('request');
const myTemperature = require('./temperature');
const myDevicesChanges = require('./devicesChanges');
const myDevice = require('./devices');
const mySensor = require('./sensors');
const logs = require('./logs');
const socket = require('./socket');
const config = require('./config')
const url = require('./url')
const TelegramBot = require('node-telegram-bot-api');
const AUTH_JWT = url.get("auth_url")
const WEBSOCKET_URL = url.get("websocket_url")

const telegram_token = process.env.TELEGRAM_TOKEN;
const telegram_id = process.env.TELEGRAM_ID;

// Created instance of TelegramBot
const bot = new TelegramBot(telegram_token, {polling: true});

module.exports={

    telegramAlert: (name, lapse, user) => {
       if (lapse){
         bot.sendMessage(telegram_id,  user + ' has activated ' + name + " for " + lapse/60000 + " minutes");
       }
       else {
         bot.sendMessage(telegram_id,  user + ' has deactivated ' + name );
       }
    },
     switchStatus: async (status, name) => {
       async function getResponse() {
        try{
            ip = await myDevice.getIpByName(name)
            let response = await superagent.get("http://"+ip+"/"+name+"/status/"+status).timeout({response: config.get("switch_status_timeout")});
            if(response.statusCode==200){
                id = await myDevice.getIdByName(name)
                await myDevice.updateDevice(id, status)
                await myDevice.setCheckDeviceByName(name, true)
                res = {};
                res.code = response.statusCode;
                res.body = response.body
                return res;
            }
        }catch (e) {
            let response = await myDevice.setCheckDeviceByName(name, false)
            logs.error(e)
            res = {};
            res.code = 400;
            res.body = response
            return res
        }finally{
                socket.device(name+" has changed to "+status)
        }
       }
       return await getResponse();
     },

     getDeviceStatus: async (name) => {
        async function status() {
            ip= await myDevice.getIpByName(name)
            let response = await superagent.get("http://"+ip+"/"+name+"/status").timeout({response: config.get("device_status_timeout")});
            return response["body"];
        }
     return await status();
     },

     getSensorStatus: async (name) => {
        async function status() {
            ip= await mySensor.getIpByName(name)
            let response = await superagent.get("http://"+ip+"/"+name+"/status").timeout({response: config.get("device_status_timeout")});
            return response["body"];
        }
     return await status();
     },

     getWebSocketDevice: async () => {
       const url = WEBSOCKET_URL+"/devices"
       let response = await superagent.get(url);
       return response.body;
     },

     changeWebSocketStatus: async (name, status) => {
       const url = WEBSOCKET_URL+"/"+name+"/"+status
       let response
       try {
         response = await superagent.post(url);
       } catch (e) {
         console.error(e);
       }finally{
         socket.deviceSocket(name+" has changed to "+status)
         myDevicesChanges.newRequest(name, status, "webSocket", null)
       }
       return response.statusCode;
     },

     auth: async (user, password) => {
       const url = AUTH_JWT+"/auth/"+user+"/"+password
       async function getResponse(url) {
         let response = await superagent.get(url);
         return response.body.jwt;
       }
       return await getResponse(url);
     },

     newUser: async (user, password, secret) => {
       const url = AUTH_JWT+"/user/"+user+"/"+password+"/"+secret
       async function getResponse(url) {
         response = await superagent.post(url);
         return response.body
       }
       return await getResponse(url);
     },

     verifyJwt: async (jwt) => {
       const url = AUTH_JWT+"/auth/jwt/"+jwt
       async function getResponse(url) {
         let response = await superagent.get(url);
         return response.jwt;
       }
       return await getResponse(url);
     },

     getUserByJWT: async (jwt) => {
        const url = AUTH_JWT+"/jwt/"+jwt
        async function getResponse(url) {
            let response = await superagent.get(url);
            if(response.status==200){return response}
            else{ throw false }
        }
       return await getResponse(url);
     },

    getStatus: (status) => {
      if (status == "true"){ return true}
      else if (status == "false"){return false}
      else{ return null }
    },

}
