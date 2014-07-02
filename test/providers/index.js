'use strict';

require('should');
var request = require('supertest');

var env = require('../../' + process.env.NODE_ENV + ".json");

var providers = Object.keys(env.providers).map(function(key) {
  return env.providers[key];
});

describe("Test providers", function() {
  describe("are up", function() {
    providers.forEach(function(url) {
      it("`" + url + "` should be up", function(done) {
        request(url)
          .post('/update')
          .expect(409)
          .end(done);
      });
    });
  });
});
