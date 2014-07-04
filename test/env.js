'use strict';

var env = process.env.API_ENV;
console.log("Testing with", env || "test-production", "environment");

module.exports = env ? require('../' + env + '.json') : require('../production.json');
module.exports.masterCredentials = process.env.CREDENTIALS || "dGVzdEBhbnlmZXRjaC5jb206cGFzc3dvcmQ=";
