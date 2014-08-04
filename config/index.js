'use strict';

var dotenv = require('dotenv');
dotenv.load();

if(!process.env.CREDENTIALS && !process.env.TOKEN) {
  console.warn("No CREDENTIALS or TOKEN. Aborting.");
  process.exit(1);
}

var env = process.env.API_ENV || "staging";
console.log("Testing with", env, "environment");

module.exports = require('./env/' + env + '.json');
module.exports.masterCredentials = process.env.CREDENTIALS;
module.exports.masterToken = process.env.TOKEN;
