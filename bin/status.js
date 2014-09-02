"use strict";

var env = require('../config');
var async = require("async");
var request = require("supertest");
var rarity = require("rarity");

var hydraters = env.hydraters;

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
    Object.keys(hydratersStatus).forEach(function(shortName) {
      console.log(hydraters[shortName], ':', hydratersStatus[shortName]);
    });

    cb();
  }
], function(err) {
  if(err) {
    throw err;
  }
  process.exit(0);
});
