'use strict';

require('should');
var request = require('supertest');
var hydraters = require('./list.js');

describe("Test hydraters", function() {
  describe("are up", function() {
    hydraters.list.forEach(function(name) {
      var url = hydraters.params[name].url;
      it("`" + url + "` should be up", function(done) {
        request(url)
          .get('/status')
          .expect(200)
          .end(done);
      });
    });
  });

  describe.skip("are working", function() {
    hydraters.list.forEach(function(name) {
      var url = hydraters.params[name].url;
      it("`" + url + "` should return expected results", function(done) {
        request(url)
          .post('/hydrate')
          .send(hydraters.params[name].post)
          .expect(200)
          .end(function(err, res) {
            if(err) {
              throw err;
            }

            var expected = require('./samples/' + name + '.hydrater.anyfetch.com.expected.json');
            res.body.should.eql(expected);

            done();
          });
      });
    });
  });
});
