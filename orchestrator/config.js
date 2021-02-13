const fs = require('fs');
const yaml = require('js-yaml')
var toYaml = require('json2yaml')
let config_file = fs.readFileSync('config.yaml');
let config = yaml.load(config_file);
//const TIMEOUT_SENSOR = config.timeout_sensor
//const TIMEOUT_CHECK = config.timeout_check
//
function refresh_config() {
  config_file = fs.readFileSync('config.yaml');
  config = yaml.load(config_file);
}
module.exports = {
  getValues: () => {return config},
  get:  (value) => {return config[value]},
  safeValues: (obj) => {
    fs.writeFileSync('config.yaml', toYaml.stringify(obj));
    refresh_config();
  }

}
