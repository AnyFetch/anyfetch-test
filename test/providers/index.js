'use strict';

require('should');
var request = require('supertest');
var async = require('async');

var env = require('../env');

var providers = Object.keys(env.providers).map(function(key) {
  return env.providers[key];
});

describe("Test providers", function() {
  describe("are up", function() {
    providers.forEach(function(url) {
      it("`" + url + "` should be up", async.retry(3, function(cb) {
        request(url)
          .post('/update')
          .expect(409)
          .end(cb);
      }));
    });
  });
});
