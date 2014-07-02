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
      metadata: {
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
      hydratedDocument.data.html.should.containDeep('aux de rupture d’approvisionne<span class="_ _2"></span>m<span class="_ _0"></span>ent</div><div class="t m0 x5 h4 yb6');
      hydratedDocument.metadata.text.should.containDeep('pour les processus');
      done();
    });
  });

  describe("should work for image documents", function() {
    this.bail(true);

    var payload = {
      identifier: config.apiUrl + 'test-image-dependencies-identifier',
      metadata: {
        path: '/test-dependancies-photo.jpg',
      },
      document_type: 'file',
      user_access: null
    };
    var file = __dirname + '/../hydraters/samples/iptc.hydrater.anyfetch.com.test.jpg';
    var hydratersToWait = ['http://iptc.hydrater.anyfetch.com/hydrate', 'http://image.hydrater.anyfetch.com/hydrate', 'http://ocr.hydrater.anyfetch.com/hydrate'];
    var hydratedDocument = null;

    helpers.sendFileAndWaitForHydration(payload, file, hydratersToWait, function(document) {
      hydratedDocument = document;
    });

    it('should have been properly hydrated', function(done) {
      hydratedDocument.should.have.property('document_type', '5252ce4ce4cfcd16f55cfa3d');
      hydratedDocument.should.have.property('metadata');
      hydratedDocument.metadata.should.have.property('author', 'Frédéric RUAUDEL');
      hydratedDocument.metadata.should.have.property('description', '© 2010 Frédéric Ruaudel, All Rights Reserved');
      hydratedDocument.metadata.should.have.property('keywords', '500px, Adulte, Blog FR, Fotografar2014, Homme, Personne, Xavier Bernard, iPhoto');
      hydratedDocument.data.should.have.property('display');
      hydratedDocument.data.should.have.property('thumb');
      hydratedDocument.should.have.property('hydrated_by');
      hydratersToWait.forEach(function(hydraterToWait) {
        hydratedDocument.hydrated_by.should.containEql(hydraterToWait);
      });

      done();
    });
  });

  describe("should hydrate attachments", function() {
    this.bail(true);

    var payload = {
      identifier: config.apiUrl + 'test-eml-identifier',
      metadata: {
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
            res.body.data[0].data.path.should.containDeep('CV.docx');
          })
          .end(done);
      }, 1000);
    });
  });

  describe("should remove useless files", function() {
    this.bail(true);

    var payload = {
      identifier: config.apiUrl + '/test-filecleaner-identifier',
      metadata: {
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
