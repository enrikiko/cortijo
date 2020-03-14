const mongoose = require('mongoose');
const logs = require('./logs');
const fs = require('fs');
const yaml = require('js-yaml');
let conf_map_file = fs.readFileSync('conf_map.yaml');
let conf_map = yaml.safeLoad(onf_map_file);
let connString = conf_map.db_url;
const db = mongoose.connection;
mongoose.connect(connString, { useNewUrlParser: true });
const config = require('./config');
db.on('error',function(){
    logs.log("Error to connect to MongoDB Wifi");
});

db.once('open', function() {
    logs.log("Conected to MongoDB Wifi");
});


const wifiSchema = new mongoose.Schema({
    device: {
        type: String,
        required: true
    },
    ssid: {
        type: String,
        required: true
    },
    signal: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
});

let myWifi = mongoose.model('Wifi', wifiSchema);

module.exports = {
    newSignal: (device, ssid, signal) => {
        let newMeasure = new myWifi(
            {
                time: new Date().getTime(),
                device: device,
                ssid: ssid,
                signal: signal
            });
        newMeasure.save(function(err) {
            if (err) throw err;
        });
    },
//
    getByDevice: async(device, time) => { return await myWifi.find({"device":device}).sort({time:-1}).limit(time)},
    getBySSID: async(ssid, time=parseInt(config.get("wifi_history"))) => { return await myWifi.find({"ssid":ssid}).sort({time:-1}).limit(time)},
    getByDeviceAndBySSID: async(device, ssid, time) => { return await myWifi.find({"ssid":ssid,"device":device}).sort({time:-1}).limit(time)}

}
