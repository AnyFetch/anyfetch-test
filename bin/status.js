"use strict";

var env = require('../config');
var async = require("async");
var request = require("supertest");
var rarity = require("rarity");

var hydraters = env.hydraters;


function repeat(string, num){
  return new Array(parseInt(num) + 1).join(string);
}


async.waterfall([
  function retrieveStatus(cb) {
    var hydratersStatus = {};
    async.each(Object.keys(hydraters), function(shortName, cb) {
      var req = request(hydraters[shortName]);
      req
        .get('/status')
        .expect(200)
        .end(function(err, res) {
          if(err) {
            throw new Error(hydraters[shortName] + ": " + err.toString());
          }

          hydratersStatus[shortName] = res.body.queued_items;
          cb();
        });
    }, rarity.carry(hydratersStatus, cb));
  },
  function displayStatus(hydratersStatus, cb) {
    console.log("Hydraters status (" + env.env + "):");
    var hydratersName = Object.keys(hydratersStatus);
    hydratersName.sort();
    hydratersName.forEach(function(shortName) {
      var base = hydraters[shortName] + ':';
      console.log(base, repeat(" ", 45 - base.length), hydratersStatus[shortName]);
    });

    cb();
  }
], function(err) {
  if(err) {
    throw err;
  }
  process.exit(0);
});
