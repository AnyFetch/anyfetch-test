'use strict';

require('should');
var request = require('supertest');

var apiUrl = process.env.API_URL || "http://api.anyfetch.com";
var basicCredential = process.env.CREDENTIALS || "dGVzdEBhbnlmZXRjaC5jb206cGFzc3dvcmQ=";
console.log(basicCredential);
var oauthCredential = null;


/**
 * Base helper for api requests authentified by basic.
 * Returns an authentified supertest client
 */
module.exports.basicApiRequest = function(method, url) {
  return request(apiUrl)
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
  oauthCredential = null;
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
  if(!oauthCredential) {
    throw new Error("Call getToken() before doing tokenApiRequest.");
  }
  return request(apiUrl)
    [method](url)
    .set('Authorization', "token " + oauthCredential);
};


/**
 * Complex helper, used to send `payload` document, then send associated `file`, and finally wait until `hydraterToWait` has returned with datas.
 * Use multiple it().
 * Example usage in dependencies.js
 */
module.exports.sendFileAndWaitForHydration = function(payload, file, hydraterToWait, cb) {

  it('... sending document', module.exports.sendDocument(payload));

  it('... sending file', module.exports.sendFile(payload.identifier, file));

  it('... waiting for hydration', function(done) {
    module.exports.waitForHydration(payload.id, hydraterToWait, cb)(done);
  });
};


/**
 * Send payload document.
 * Insert resulting id in payload.id
 */
module.exports.sendDocument = function(payload) {
  return function(done) {
    module.exports.tokenApiRequest('post', '/providers/documents')
      .send(payload)
      .expect(200)
      .end(function(err, res) {
        if(err) {
          throw err;
        }

        payload.id = res.body.id;

        done();
      });
  };
};


/**
 * Associate file with identifier
 */
module.exports.sendFile = function(identifier, file) {
  return function(done) {
    module.exports.tokenApiRequest('post', '/providers/documents/file')
      .field('identifier', identifier)
      .attach('file', file)
      .expect(204)
      .end(done);
  };
};


/**
 * Block until hydraterToWait has hydrated id.
 * If cb is provided, it will be called with the result document once hydraterToWait has finished.
 */
module.exports.waitForHydration = function(id, hydraterToWait, cb) {
  return function(done) {
    var retry = setInterval(function() {
      module.exports.tokenApiRequest('get', '/documents/' + id + "/raw")
      .expect(200)
      .expect(function(res) {
        if(res.body.hydrated_by.indexOf(hydraterToWait) !== -1) {

          // Return to original caller with document information
          if(cb) {
            cb(res.body);
          }

          // Office hydrater completed!
          // We can now finish the test.
          clearInterval(retry);

          if(!done.called) {
            done();
            done.called = true;
          }
        }
      })
      .end(function(err) {
        // Do nothing and retry.
        if(err) {
          throw err;
        }
      });
    }, 2000);
  };
};
