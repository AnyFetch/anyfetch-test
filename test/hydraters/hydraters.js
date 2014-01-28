'use strict';

var request = require('supertest');
require('should');

var hydraters = require('./list.js');

describe("Test on the hydrators", function () {
  describe("Ping all the hydraters on /hydrate.", function () {
    hydraters.list.forEach(function(name) {
      console.log(hydraters.params[name].url);
      var req = request(hydraters.params[name].url);
      it("should receive a code 405 for the " + name, function (done) {
        req.post('/hydrate')
          .expect(405)
          .end(done);
      });
    });
  });


  describe("Send a document to all the hydraters on /hydrate and test the answer", function () {
    hydraters.list.forEach(function(name) {
      var req = request(hydraters.params[name].url);
      it("should receive a json code " + name, function (done) {
        req.post('/hydrate')
          .send(hydraters.params[name].post)
          .expect(200)
          .end(function(err, res) {
            console.log("Hydrater : ", name);
            console.log(res.body);
            done();
          });
      });
    });
  });
});