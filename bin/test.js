#!/bin/env node
'use strict';

var shellExec = require('child_process').exec;
var async = require('async');
var request = require('request');

var prodEnv = {
  API_URL: "https://api.anyfetch.com",
  CREDENTIALS: "dGVzdEBhbnlmZXRjaC5jb206cGFzc3dvcmQ=",
  NODE_ENV: 'test',
};

var stagingEnv = {
  API_URL: "http://staging.api.anyfetch.com",
  CREDENTIALS: "c3RhZ2luZy50ZXN0QGFueWZldGNoLmNvbTpwYXNzd29yZA==",
  NODE_ENV: 'test',
};


var removeColor = function(input) {
  var output = input.replace(/\[[0-9]+m/g, '');
  output = output.replace(/[^a-z0-9 \n:\-&\(\)]/gi, '&emsp&emsp');
  output = output.replace(/\n/g, '<br>');
  return output;
};

async.parallel([
  function prodTest(cb) {
    shellExec('./node_modules/mocha/bin/_mocha -R spec test/*/* -t 120000 -s 20000', {env: prodEnv, cwd: __dirname + '/..'}, function (err, stdout, stderr) {
      if(stderr){
        var json = {
          "subject": "anyfetch-test on PROD FAILED",
          "from_address": "deploy@anyfetch.com",
          "source": "anyfetch-test",
          "content": JSON.stringify(removeColor(stderr)),
          "tags": ["server", "api", "test", "#FAIL", "#PRODUCTION"]
        };
        request.post({url: "https://api.flowdock.com/v1/messages/team_inbox/" + process.env.FLOWDOCK, json: json}, cb);
      }
      else {
        cb();
      }
    });
  },
  function prodTest(cb) {
    shellExec('./node_modules/mocha/bin/_mocha -R spec test/*/* -t 120000 -s 20000', {env: stagingEnv, cwd: __dirname + '/..'}, function (err, stdout, stderr) {
      if(stderr){
        var json = {
          "subject": "anyfetch-test on STAGING FAILED",
          "from_address": "deploy@anyfetch.com",
          "source": "anyfetch-test",
          "content": JSON.stringify(removeColor(stderr)),
          "tags": ["server", "api", "test", "#FAIL", "#STAGING"]
        };
        request.post({url: "https://api.flowdock.com/v1/messages/team_inbox/" + process.env.FLOWDOCK, json: json}, cb);
      }
      else {
        cb();
      }
    });
  }
]);
