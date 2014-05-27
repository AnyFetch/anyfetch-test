'use strict';

require('should');

var helpers = require('./helpers.js');
var config = require('../config.js');

describe("Test hydraters dependencies", function() {
  before(helpers.createAccount);
  before(helpers.resetAccount);
  before(helpers.getToken);

  describe("should work for office documents", function() {
    this.bail(true);

    var payload = {
      identifier: config.apiUrl + 'test-office-dependencies-identifier',
      metadatas: {
        path: '/test-dependencies-sample.doc',
      },
      document_type: 'file',
      user_access: null
    };
    var file = __dirname + '/samples/office-file.doc';
    var hydraterToWait = 'http://office.hydrater.anyfetch.com/hydrate';
    var hydratedDocument = null;

    helpers.sendFileAndWaitForHydration(payload, file, hydraterToWait, function(document) {
      hydratedDocument = document;
    });

    it('should have been properly hydrated', function(done) {
      // Real test.
      hydratedDocument.datas.html.should.include('aux de rupture d’approvisionne<span class="_ _2"></span>m<span class="_ _0"></span>ent</div><div class="t m0 x5 h4 yb6');
      hydratedDocument.metadatas.text.should.include('pour les processus');
      done();
    });
  });

  describe("should hydrate attachments", function() {
    this.bail(true);

    var payload = {
      identifier: config.apiUrl + 'test-eml-identifier',
      metadatas: {
        path: '/test-dependencies-sample.eml',
      },
      document_type: 'file',
      user_access: null
    };
    var file = __dirname + '/samples/eml-with-attachment.eml';
    var hydraterToWait = 'http://eml.hydrater.anyfetch.com/hydrate';

    helpers.sendFileAndWaitForHydration(payload, file, hydraterToWait);

    it('should have been properly hydrated', function(done) {
      // Real test.
      setTimeout(function() {
        helpers.basicApiRequest('get', '/documents?search=CV.docx')
          .expect(200)
          .expect(function(res)
          {
            res.body.datas.should.have.lengthOf(1);
            res.body.datas[0].datas.path.should.include('CV.docx');
          })
          .end(done);
      }, 1000);
    });
  });

  describe("should remove useless files", function() {
    this.bail(true);

    var payload = {
      identifier: config.apiUrl + 'test-filecleaner-identifier',
      metadatas: {
        path: '/test-filecleaner.DS_STORE',
      },
      document_type: 'file',
      user_access: null
    };
    var file = __dirname + '/samples/.DS_STORE';

    it('... sending document', helpers.sendDocument(payload));
    it('... sending file', helpers.sendFile(payload, file));

    it('should have been properly removed', function(done) {
      function checkHydration() {
        helpers.basicApiRequest('get', '/documents/identifier/' + encodeURIComponent(payload.identifier) + '/raw')
        .end(function(err, res) {
          if(err) {
            throw err;
          }
          if(res.statusCode === 404) {
            done();
          }
          else {
            // Let's try again
            setTimeout(checkHydration, 2000);
          }
        });
      }
      setTimeout(checkHydration, 2000);
    });
  });

  after(helpers.deleteAccount);
});
