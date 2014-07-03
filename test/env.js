'use strict';

var env = process.env.NODE_ENV;
console.log("Testing with", env || "test-production", "environment");

module.exports = env ? require('../' + env + '.json') : require('../production.json');
module.exports.credentials = process.env.CREDENIALS || "dGVzdEBhbnlmZXRjaC5jb206cGFzc3dvcmQ=";