#!/bin/env node
'use strict';

var shellExec = require('child_process').exec;
var async = require('async');
var request = require('request');

var prodEnv = {
  prodApiUrl: "https://api.anyfetch.com",
  prodCredentials: "dGVzdEBhbnlmZXRjaC5jb206cGFzc3dvcmQ="
};

var stagingEnv = {
  prodApiUrl: "http://staging.api.anyfetch.com",
  prodCredentials: "c3RhZ2luZy50ZXN0QGFueWZldGNoLmNvbTpwYXNzd29yZA=="
};

async.parallel([
  function prodTest(cb) {
    shellExec('npm test', {env: prodEnv, cwd: "/home/node/anyfetch-test/"}, function (err, stderr) {
      if(err) {
        throw err;
      }
      if(stderr){
        var json = {
          "subject": "anyfetch-test on PROD FAILED",
          "from_address": "deploy@anyfetch.com",
          "source": "anyfetch-test",
          "content": JSON.stringify(stderr),
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
    shellExec('npm test', {env: stagingEnv, cwd: "/home/node/anyfetch-test/"}, function (err, stderr) {
      if(err) {
        throw err;
      }
      if(stderr){
        var json = {
          "subject": "anyfetch-test on STAGING FAILED",
          "from_address": "deploy@anyfetch.com",
          "source": "anyfetch-test",
          "content": JSON.stringify(stderr),
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
