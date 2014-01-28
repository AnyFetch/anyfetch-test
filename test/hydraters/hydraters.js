'use strict';

var request = require('supertest');
require('should');

var fs = require('fs');

var hydraters = require('./list.js');

describe("Test on the hydrators", function () {
  describe.skip("Ping all the hydraters on /hydrate.", function () {
    hydraters.list.forEach(function(name) {
      var req = request(hydraters.params[name].url);
      it("should receive a code 405 for the " + name, function (done) {
        req.post('/hydrate')
          .expect(405)
          .end(done);
      });
    });
  });


  describe("Send a document to all the hydraters on /hydrate and test the answer", function () {
    /*hydraters.list.forEach(function(name) {//*/
      var name = 'pdf';
      var req = request(hydraters.params[name].url);
      it("should receive a json code " + name, function (done) {
        req.post('/hydrate')
          .send(hydraters.params[name].post)
          .expect(200)
          .end(function(err, res) {
            console.log(res.body);
            var file = __dirname + '/samples/' + name + '.hydrater.anyfetch.com.expected.json';
            fs.writeFileSync(file, JSON.stringify(res.body));
            //var data = require(file);
            //res.body.should.eql(data);
            done();
          });
      });
    /*});//*/
  });
});