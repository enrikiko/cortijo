const fs = require('fs');
const yaml = require('js-yaml')
var toYaml = require('json2yaml')
let config_file = fs.readFileSync('config_url.yaml');
let config = yaml.safeLoad(config_file);

module.exports = {
  get:  (value) => {return config[value]},
}
