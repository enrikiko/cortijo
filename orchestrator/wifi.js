const mongoose = require('mongoose');
const logs = require('./logs');
const conf_map = require('./url');
const config = require('./config');

const mongo_db = conf_map.get("db_url");
const db = mongoose.connection;
mongoose.connect(mongo_db, { useNewUrlParser: true, useUnifiedTopology: true});


db.on('error',function(){
    logs.error("Error to connect to MongoDB Wifi");
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
