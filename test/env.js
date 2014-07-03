'use strict';

var env = process.env.NODE_ENV;

console.log("Testing with", env ? env: "../test-production.json", "environment");

module.exports = env ? require('../' + env + '.json') : require('../test-production.json');
