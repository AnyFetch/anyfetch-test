'use strict';

require('should');
var request = require('supertest');

var up = require('../../helpers/up.js');
var env = require('../../../config');

describe("Test front and back ends", function() {
  var hosts = {};
  hosts[env.appUrl] = {
    url: env.appUrl,
    expected: 200
  },
  hosts[env.apiUrl] = {
    url: env.apiUrl + '/status',
    expected: 200
  };
  hosts[env.managerUrl] = {
    url: env.managerUrl,
    expected: 200
  };
  hosts[env.kueUrl] = {
    url: env.managerUrl,
    expected: 200
  };

  up.generateDescribe(hosts);

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
