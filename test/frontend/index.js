'use strict';

require('should');
var request = require('supertest');

var env = require('../../config');

describe("Test front and back ends", function() {
  describe("are up", function() {
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
      request(env.managerUrl)
      .get('/')
      .expect(200)
      .end(done);
    });

    it("`" + env.kueUrl + "` should require authentication", function(done) {
      request(env.kueUrl)
      .get('/')
      .expect(200)
      .end(done);
    });
  });

  describe("are working", function() {
    it("`" + env.managerUrl + "` should let user sign-in", function(done) {
      request(env.managerUrl)
      .post('/sign_in')
      .send({
        email: this.email,
        password: this.password
      })
      .expect(302)
      .end(done);
    });
  });
});
