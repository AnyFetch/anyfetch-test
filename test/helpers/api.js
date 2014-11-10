'use strict';

require('should');
var request = require('supertest');
var async = require('async');
var fs = require('fs');

var warmer = require('./warmer');

var env = require('../../config');


/**
 * Base helper for api requests authentified by basic.
 * Returns an authentified supertest client
 */
module.exports.basicApiRequest = function basicApiRequest(method, url) {
  return request(env.apiUrl)
    [method](url)
    .set('Authorization', 'Basic ' + env.credentials.basic);
};


/**
 * Request helper to expect JSON results
 */
module.exports.expectJSON = function expectJSON(key, value) {
  return function(res) {
    res.body.should.have.property(key, value);
  };
};


module.exports.reset = function resetCompany(done) {
  env.credentials.token = null;
  request(env.apiUrl)
    .del('/company/reset')
    .set('Authorization', 'Basic ' + env.credentials.basic)
    .expect(204)
    .end(done);
};


module.exports.getToken = function resetCompany(done) {
  request(env.apiUrl)
    .get('/token')
    .set('Authorization', 'Basic ' + env.credentials.basic)
    .expect(200)
    .expect(function(res) {
      env.credentials.token = res.body.token;
    })
    .end(done);
};

/**
 * Base helper for api requests authentified by tokens.
 * Returns an authentified supertest client
 */
module.exports.tokenApiRequest = function tokenApiRequest(method, url) {
  return request(env.apiUrl)
    [method](url)
    .set('Authorization', "Bearer " + env.credentials.token);
};


/**
 * Send one document and an associated file to the API using the warmer for faster results.
 * You need to send your `this` context from mocha. A specific `before` will be registered one level higher than the current `describe()`, letting us pre-warm the query before entering the describe.
 */
module.exports.sendDocumentAndFile = function sendFile(payload, file) {
  if(!this.parent) {
    throw new Error("Call sendDocumentAndFile with a this context from Mocha -- a before() will be hooked onto your parent describe.");
  }

  var documentWarmer;
  var fileWarmer = {};

  // Register a before on the parent describe
  this.parent.beforeAll.call(this.parent, function(done) {
    documentWarmer = warmer.prepareRequests({
      document: module.exports.buildDocumentRequest(payload)
    });

    warmer.untilChecker(documentWarmer, 'document', function(err) {
      if(!err) {
        fileWarmer = warmer.prepareRequests({
          file: module.exports.buildFileRequest(payload, file)
        });
      }
      // if there is an error, it will be handled later, in the `it` call
      documentWarmer.documentSent = [err];
    });

    // Call done directly, without waiting for any return
    done();
  });

  it('... sending document', function(done) {
    // Listen the `documentSent` key, not `document`, to ensure the fileWarmer object is initialized.
    warmer.untilChecker(documentWarmer, 'documentSent', done);
  });

  it('... sending file', function(done) {
    warmer.untilChecker(fileWarmer, 'file', done);
  });
};

/**
 * Complex helper, used to send `payload` document, then send associated `file`, and finally wait until `hydraterToWait` has returned with data.
 * Use multiple it().
 * Example usage in dependencies.js
 */
module.exports.sendDocumentAndFileAndWaitForHydration = function sendFileAndWaitForHydration(payload, file, hydratersToWait, cb) {

  module.exports.sendDocumentAndFile.call(this, payload, file);

  it('... waiting for hydration', function(done) {
    module.exports.waitForHydration(payload.id, hydratersToWait, cb)(done);
  });
};


/**
 * Send payload document.
 */
module.exports.sendDocument = function sendDocument(payload) {
  return function(done) {
    module.exports.buildDocumentRequest(payload)
      .end(done);
  };
};


/**
 * Build a request to send a document
 * Insert resulting id in payload.id
 */
module.exports.buildDocumentRequest = function buildDocumentRequest(payload) {
  return module.exports.tokenApiRequest('post', '/documents')
    .send(payload)
    .expect(200)
    .expect(function(res) {
      payload.id = res.body.id;
    });
};


/**
 * Associate file with identifier
 */
module.exports.sendFile = function sendFile(payload, file) {
  return function(done) {
    module.exports.buildFileRequest(payload, file)
      .end(done);
  };
};


/**
 * Build the request to send a file
 */
module.exports.buildFileRequest = function buildFileRequest(payload, file) {
  return module.exports.tokenApiRequest('post', '/documents/' + payload.id + '/file')
    .attach('file', file)
    .expect(204);
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
    var checkHydration = function checkHydration(tryAgain) {
      module.exports.tokenApiRequest('get', '/documents/' + id + "/raw")
      .expect(200)
      .end(function(err, res) {
        if(err) {
          return done(err);
        }

        if(res.body.hydrater_errored) {
          return done(new Error("Got an hydration error with " + res.body.hydrater_errored + ": " + res.body.hydration_error));
        }

        var isAllHydrated = function(hydraterToWait) {
          return res.body.hydrated_by.indexOf(hydraterToWait + "/hydrate") !== -1;
        };

        if(hydratersToWait.every(isAllHydrated)) {
          // Return to original caller with document information
          if(cb) {
            cb(res.body);
          }
          return done();
        }
        else {
          return tryAgain();
        }
      });
    };

    module.exports.wait(checkHydration);
  };
};


/**
 * Repeatedly call `checker` function with `done` and `tryAgain` function.
 * Checker can ask to be called again at a later time by calling `tryAgain()` instead of `done()`
 */
module.exports.wait = function loopUntil(checker) {
  var previousError;

  var tryAgain = function(err) {
    if(err && process.env.VERBOSE) {
      var errString = err.toString();
      if(previousError !== errString) {
        previousError = errString;
        console.warn("\x1b[0mwarn:\x1b[0m", errString);
      }
    }

    var timer = setTimeout(function() {
      checker(tryAgain);
    }, 500);
    timer.unref();
  };

  checker(tryAgain);
};
