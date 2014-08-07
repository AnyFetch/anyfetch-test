'use strict';

require('should');
var request = require('supertest');

var env = require('../../../config');

var oauthCredential = null;


/**
 * Base helper for api requests authentified by basic.
 * Returns an authentified supertest client
 */
module.exports.basicApiRequest = function basicApiRequest(method, url) {
  return request(env.apiUrl)
    [method](url)
    .set('Authorization', 'Basic ' + env.basicCredentials);
};


/**
 * Reset the account to pristine state
 */
module.exports.resetAccount = function resetAccount(done) {
  oauthCredential = null;
  module.exports.basicApiRequest('del', '/company/reset')
    .set('Content-Length', 0)
    .expect(204)
    .end(done);
};


/**
 * Request helper to expect JSON results
 */
module.exports.expectJSON = function expectJSON(key, value) {
  return function(res) {
    res.body.should.have.property(key, value);
  };
};


/** Helper to get a token
 *
 */
module.exports.getToken = function getToken(cb) {
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
module.exports.tokenApiRequest = function tokenApiRequest(method, url) {
  if(!oauthCredential) {
    throw new Error("Call getToken() before doing tokenApiRequest.");
  }
  return request(env.apiUrl)
    [method](url)
    .set('Authorization', "Bearer " + oauthCredential);
};


/**
 * Complex helper, used to send `payload` document, then send associated `file`, and finally wait until `hydraterToWait` has returned with data.
 * Use multiple it().
 * Example usage in dependencies.js
 */
module.exports.sendFileAndWaitForHydration = function sendFileAndWaitForHydration(payload, file, hydratersToWait, cb) {
  it('... sending document', module.exports.sendDocument(payload));

  it('... sending file', module.exports.sendFile(payload, file));

  it('... waiting for hydration', function(done) {
    module.exports.waitForHydration(payload.id, hydratersToWait, cb)(done);
  });
};


/**
 * Send payload document.
 * Insert resulting id in payload.id
 */
module.exports.sendDocument = function sendDocument(payload) {
  return function(done) {
    module.exports.tokenApiRequest('post', '/documents')
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
module.exports.sendFile = function sendFile(payload, file) {
  return function(done) {
    module.exports.tokenApiRequest('post', '/documents/' + payload.id + '/file')
      .attach('file', file)
      .expect(204)
      .end(done);
  };
};


/**
 * Block until hydraterToWait has hydrated id.
 * If cb is provided, it will be called with the result document once all hydraters in hydratersToWait have finished.
 */
module.exports.waitForHydration = function waitForHydration(id, hydratersToWait, cb) {
  // transform a string to array
  if(!(hydratersToWait instanceof Array)) {
    hydratersToWait = [hydratersToWait];
  }

  return function(done) {
    function checkHydration() {
      module.exports.tokenApiRequest('get', '/documents/' + id + "/raw")
      .expect(200)
      .end(function(err, res) {
        if(err) {
          throw err;
        }

        var isAllHydrated = function(hydraterToWait) {
          return res.body.hydrated_by.indexOf(hydraterToWait + "/hydrate") !== -1;
        };

        if(hydratersToWait.every(isAllHydrated)) {
          // Return to original caller with document information
          if(cb) {
            cb(res.body);
          }
          done();
        }
        else {
          // Let's try again
          setTimeout(checkHydration, 2000);
        }

      });
    }

    setTimeout(checkHydration, 2000);
  };
};
