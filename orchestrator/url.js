const fs = require('fs');
const yaml = require('js-yaml')
let config_file = fs.readFileSync('config_url.yaml');
let config = yaml.load(config_file);

module.exports = {
  get:  (value) => {return config[value]},
}
