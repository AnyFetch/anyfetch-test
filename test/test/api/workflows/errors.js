'use strict';

require('should');

var helpers = require('../../../helpers/api');

var env = require('../../../../config');


var checkErroredHydration = function(id, hydraterToWait, cb) {
  return function(done) {
    function checkErroredHydration(tryAgain) {
      helpers.tokenApiRequest('get', '/documents/' + id + "/raw")
      .expect(200)
      .end(function(err, res) {
        if(err) {
          throw err;
        }

        if(res.body.hydrater_errored === hydraterToWait) {
          // Return to original caller with document information
          if(cb) {
            cb(res.body);
          }
          done();
        }
        else {
          // Let's try again
          tryAgain();
        }

      });
    }
    helpers.wait(checkErroredHydration);
  };

};

describe("Test errored documents", function() {
  before(helpers.reset);
  before(helpers.getToken);

  describe("should have an error", function() {
    var payload = {
      identifier: env.apiUrl + 'test-error-document-identifier',
      metadatas: {
        path: '/test-errors-sample.pdf',
      },
      document_type: 'file',
      user_access: null
    };
    var file = __dirname + '/samples/errored.pdf';
    var hydraterToWait = env.hydraters.pdf;
    var hydratedDocument = null;

    helpers.sendDocumentAndFile.call(this, payload, file);

    it('... waiting for hydration', function(done) {
      this.timeout(60000);

      checkErroredHydration(payload.id, hydraterToWait + "/hydrate", function(document) {
        hydratedDocument = document;
      })(done);
    });

    it('should have been properly errored', function(done) {
      // Real test.
      hydratedDocument.should.have.property("hydrater_errored", env.hydraters.pdf + "/hydrate");
      hydratedDocument.should.have.property("hydration_error").and.containDeep("May not be a PDF file (continuing anyway)\nSyntax Error:");
      done();
    });
  });
});
