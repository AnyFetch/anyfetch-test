'use strict';

require('should');
var request = require('supertest');

var SETTINGS_URL = "http://settings.anyfetch.com";
var SIGN_UP_URL = '/users/sign_up';
var DELETE_URL = '/users/';

var basicCredential = "dGVzdEBhbnlmZXRjaC5jb206cGFzc3dvcmQ=";
var oauthCredential = null;

/**
 * Base helper for api requests authentified by basic.
 * Returns an authentified supertest client
 */
module.exports.basicApiRequest = function(method, url) {
  return request("http://api.anyfetch.com")
    [method](url)
    .set('Authorization', 'Basic ' + basicCredential);
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
  module.exports.basicApiRequest('del', '/reset')
    .set('Content-Length', 0)
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

/** Helper to get a token
 *
 */
module.exports.getToken = function(cb) {
  module.exports.basicApiRequest('get', '/token')
  .expect(200)
  .end(function(err, res){
    oauthCredential = res.body.token;
    cb(err, res.body.token);
  });
};

/**
 * Base helper for api requests authentidief by tokens.
 * Returns an authentified supertest client
 */
module.exports.tokenApiRequest = function(method, url) {
  return request("http://api.anyfetch.com")
    [method](url)
    .set('Authorization', "token " + oauthCredential);
};
