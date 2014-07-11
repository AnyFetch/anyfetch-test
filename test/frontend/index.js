'use strict';

require('should');
var request = require('supertest');

var env = require('../env');

describe("Test front and back ends", function() {
  it("`" + env.appUrl + "` should be up", function(done) {
    request(env.appUrl)
    .get('/')
    .expect(function(res){
      if (res.statusCode !== 200 && res.statusCode !== 302){
        throw new Error(res.statusCode);
      }
    })
    .end(done);
  });

  it("`" + env.apiUrl + "` should be up", function(done) {
    request(env.apiUrl)
    .get('/status')
    .expect(200)
    .end(done);
  });

  it("`" + env.managerUrl + "` should be up", function(done) {
    request(env.apiUrl)
    .get('/status')
    .expect(200)
    .end(done);
  });
});
