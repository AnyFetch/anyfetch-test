'use strict';

require('should');

var helpers = require('./helpers.js');
var config = require('../config.js');

describe.only("Test errored documents", function() {
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

    helpers.sendFileAndWaitForHydration(payload, file, hydraterToWait, function(document) {
      hydratedDocument = document;
    });

    it('should have been properly errored', function(done) {
      // Real test.
      hydratedDocument.should.have.property("hydraterErrored", "http://pdf.hydrater.anyfetch.com/hydrate");
      hydratedDocument.should.have.property("hydrationErrored", "http://pdf.hydrater.anyfetch.com/hydrate");
      done();
    });
  });


  after(helpers.deleteAccount);
});
