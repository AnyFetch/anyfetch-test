'use strict';

require('should');

var helpers = require('./helpers.js');
var config = require('../config.js');


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
  before(helpers.createAccount);
  before(helpers.resetAccount);
  before(helpers.getToken);

  describe("should have an error", function() {
    this.bail(true);

    var payload = {
      identifier: config.apiUrl + 'test-error-document-identifier',
      metadatas: {
        path: '/test-errors-sample.pdf',
      },
      document_type: 'file',
      user_access: null
    };
    var file = __dirname + '/samples/errored.pdf';
    var hydraterToWait = 'http://pdf.hydrater.anyfetch.com/hydrate';
    var hydratedDocument = null;

    it('... sending document', helpers.sendDocument(payload));

    it('... sending file', helpers.sendFile(payload, file));

    it('... waiting for hydration', function(done) {
      checkErroredHydration(payload.id, hydraterToWait, function(document) {
        hydratedDocument = document;
      })(done);
    });

    it('should have been properly errored', function(done) {
      // Real test.
      hydratedDocument.should.have.property("hydrater_errored", "http://pdf.hydrater.anyfetch.com/hydrate");
      hydratedDocument.should.have.property("hydration_error").and.containDeep("May not be a PDF file (continuing anyway)\nSyntax Error:");
      done();
    });
  });


  after(helpers.deleteAccount);
});