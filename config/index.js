'use strict';

var dotenv = require('dotenv');
dotenv.load();

if(!process.env.CREDENTIALS && !process.env.TOKEN) {
  console.warn("No CREDENTIALS or TOKEN. Aborting.");
  process.exit(1);
}

if(!process.env.API_ENV) {
  process.env.API_ENV = "staging";
}
var env = process.env.API_ENV;

module.exports = require('./env/' + env + '.json');
module.exports.env = env;
module.exports.masterCredentials = process.env.CREDENTIALS;
module.exports.masterToken = process.env.TOKEN;
