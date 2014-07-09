'use strict';

var env = process.env.API_ENV;
console.log("Testing with", env || "staging", "environment");

module.exports = env ? require('../' + env + '.json') : require('../staging.json');
module.exports.masterCredentials = process.env.CREDENTIALS || "dGVzdEBhbnlmZXRjaC5jb206cGFzc3dvcmQ=";
module.exports.masterToken = process.env.TOKEN;
