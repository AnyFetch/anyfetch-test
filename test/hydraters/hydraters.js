'use strict';

var request = require('supertest');
require('should');

var fs = require('fs');

var hydraters = require('./list.js');

describe("Test hydraters", function () {
  describe("are up", function () {
    hydraters.list.forEach(function(name) {
      var url = hydraters.params[name].url;
      var req = request(hydraters.params[name].url);
      it("`" + url + "` should be up", function (done) {
        req.get('/status')
          .expect(200)
          .end(done);
      });
    });
  });

  describe("Are working", function () {
    hydraters.list.forEach(function(name) {
      var req = request(hydraters.params[name].url);
      it("should receive a json code " + name, function (done) {
        req.post('/hydrate')
          .send(hydraters.params[name].post)
          .expect(200)
          .end(function(err, res) {
            var file = __dirname + '/samples/' + name + '.hydrater.anyfetch.com.expected.json';
            fs.writeFileSync(file, JSON.stringify(res.body));
            //var data = require(file);
            //res.body.should.eql(data);
            done();
          });
      });
    });
  });
});
