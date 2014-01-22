'use strict';

var request = require('supertest');
require('should');

var hydraters = require('./list.js');


describe("Ping all the hydraters on /hydrate.", function () {
  hydraters.list.forEach(function(name) {
    var req = request(hydraters.params[name].url);
    it("should receive a code 405 for the " + name, function (done) {
      req.post('/')
        .expect(405)
        .end(done);
    });
  });
});


describe("Send a document to all the hydraters on /hydrate and test it", function () {
  hydraters.list.forEach(function(name) {
    var req = request(hydraters.params[name].url);
    it("should receive a json code " + name, function (done) {
      req.post('/')
        .expect(405)
        .end(done);
    });
  });
});