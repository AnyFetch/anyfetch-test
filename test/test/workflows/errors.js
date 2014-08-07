'use strict';

require('should');

var helpers = require('../../helpers/api');

var env = require('../../../config');


var checkErroredHydration = function(id, hydraterToWait, cb) {
  return function(done) {
    function checkErroredHydration() {
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
          setTimeout(checkErroredHydration, 2000);
        }

      });
    }
    setTimeout(checkErroredHydration, 2000);
  };

};

describe("Test errored documents", function() {

  describe("should have an error", function() {
    this.bail(true);

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

    it('... sending document', helpers.sendDocument(payload));

    it('... sending file', helpers.sendFile(payload, file));

    it('... waiting for hydration', function(done) {
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
