'use strict';

require('should');
var request = require('supertest');

var urlFront = ['http://app.anyfetch.com', 'http://staging.app.anyfetch.com'];
var urlBack = ['http://api.anyfetch.com', 'http://staging.api.anyfetch.com'];

describe("Test front and back ends", function() {
  urlFront.forEach(function(url){
    it("`" + url + "` should be up", function(done) {
      request(url)
      .get('/')
      .expect(function(res){
        if (res.statusCode !== 200 && res.statusCode !== 302){
          throw new Error(res.statusCode);
        }
      })
      .end(done);
    });
  });
  urlBack.forEach(function(url){
    it("`" + url + "` should be up", function(done) {
      request(url)
      .get('/status')
      .expect(200)
      .end(done);
    });
  });
});
