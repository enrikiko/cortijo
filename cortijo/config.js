const fs = require('fs');
const yaml = require('js-yaml')
const config_file = fs.readFileSync('config.yaml');
const config = yaml.safeLoad(config_file);
//const TIMEOUT_SENSOR = config.timeout_sensor
//const TIMEOUT_CHECK = config.timeout_check
//
module.exports = {

  getValues: () => {return config},
  get:  (value) => {return config[value]},
  safeValues: (obj) => {
    fs.writeFile('./config.yaml', yaml.safeDump(obj), (err) => {
    if (err) {
        console.log(err);
    }
});
}

}
