const fs = require('fs');
const yaml = require('js-yaml')
let config_file = fs.readFileSync('config/config_url.yaml');
let config = yaml.safeLoad(config_file);

module.exports = {
  get:  (value) => {return config[value]},
}
