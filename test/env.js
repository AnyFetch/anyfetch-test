'use strict';

if(!process.env.CREDENTIALS && !process.env.TOKEN) {
  console.warn("No CREDENTIALS or TOKEN. Aborting.");
  process.exit();
}

var env = process.env.API_ENV;
console.log("Testing with", env || "staging", "environment");

module.exports = env ? require('../' + env + '.json') : require('../staging.json');
module.exports.masterCredentials = process.env.CREDENTIALS;
module.exports.masterToken = process.env.TOKEN;
