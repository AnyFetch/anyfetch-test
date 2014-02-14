'use strict';

require('should');

var helpers = require('./helpers.js');

describe.only("Test hydraters dependencies", function() {
  before(helpers.createAccount);
  before(helpers.resetAccount);
  before(helpers.getToken);

  describe("should work for office documents", function() {
    this.bail(true);

    var payload = {
      no_hydration: true,
      identifier:'test-office-dependencies-identifier',
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
      hydratedDocument.datas.content.should.include('pers<span class="_ _1"></span>onnalité</div><div class="t m0 x5 h4 yc ff3 fs1 fc0 sc0 ls0 ws0">juridique)');
      done();
    });
  });

  describe("should hydrate attachments", function() {
    this.bail(true);

    var payload = {
      no_hydration: true,
      identifier:'test-eml-dependencies-identifier',
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
            res.body.datas[0].datas.path.should.include('CV.docx');
          })
          .end(done);
      }, 1000);
    });
  });

  after(helpers.deleteAccount);
});
