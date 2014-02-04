'use strict';

require('should');
var request = require('supertest');

var SETTINGS_URL = "http://settings.anyfetch.com";
var SIGN_UP_URL = '/users/sign_up';
var DELETE_URL = '/users/';

/**
 * Base helper for all api requests.
 * Returns an authentified supertest client
 */
module.exports.apiRequest = function(method, url) {
  return request("http://api.anyfetch.com")
    [method](url)
    .set('Authorization', 'Basic dGVzdEBhbnlmZXRjaC5jb206cGFzc3dvcmQ=');
};

module.exports.createAccount = function(done) {
  // Skipping for now
  return done();

  // request(SETTINGS_URL)
  //   .post(SIGN_UP_URL)
  //   .send({
  //     "user[email]": "test@anyfetch.com",
  //     "user[password]": "password"
  //   })
  //   .expect(302)
  //   .end(done);
};

module.exports.deleteAccount = function(done) {
  // Skipping for now
  return done();

  // request("http://settings.anyfetch.com")
  //   .del(DELETE_URL)
  //   .send({
  //     "user[email]": "test@anyfetch.com",
  //     "user[password]": "password"
  //   })
  //   .expect(302)
  //   .end(done);
};

/**
 * Reset the account to pristine state
 */
module.exports.resetAccount = function(done) {
  module.exports.apiRequest('del', '/reset')
    .expect(204)
    .end(done);
};

/**
 * Request helper to expect JSON results
 */
module.exports.expectJSON = function(key, value) {
  return function(res) {
    res.body.should.have.property(key, value);
  };
};
