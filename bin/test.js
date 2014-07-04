#!/bin/env node
'use strict';

var shellExec = require('child_process').exec;
var async = require('async');
var request = require('supertest');


var removeColor = function(input) {
  var output = input.replace(/\[[0-9]+m/g, '');
  output = output.replace(/[^a-z0-9 \n:\-\.&\(\)\/;]/gi, '');
  output = output.replace(/\n/g, '<br>');
  return output;
};

var envArgs = process.argv.slice(2);

var tests = [];

envArgs.forEach(function(env) {
  tests.push(function test(cb) {
    process.env.API_ENV = env;
    shellExec('API_ENV=' + env + ' ./node_modules/mocha/bin/_mocha -R spec test/*/* -t 120000 -s 20000', {env: require("../test/env"), cwd: __dirname + '/..'}, function (err, stdout, stderr) {
      if(stderr){
        var json = {
          "subject": "anyfetch-test on " + env.toUpperCase() + "FAILED",
          "from_address": "deploy@anyfetch.com",
          "source": "anyfetch-test",
          "content": JSON.stringify(removeColor(stderr)),
          "tags": ["server", "api", "test", "#FAIL", "#" + env.toUpperCase()]
        };
        request("https://api.flowdock.com")
          .post("/v1/messages/team_inbox/" + process.env.FLOWDOCK)
          .send(json)
          .expect(200)
          .end(cb);
      }
      else {
        console.log("successfull test");
        cb();
      }
    });
  });
});

console.log(tests);
async.parallel(tests);
