'use strict';

require('should');

var helpers = require('../../../helpers/api');

var env = require('../../../../config');


describe("Test hydraters dependencies", function() {
  before(helpers.reset);
  before(helpers.getToken);

  describe("should work for office documents", function() {
    var payload = {
      identifier: env.apiUrl + '/test-office-dependencies-identifier',
      metadata: {
        path: '/test-dependencies-sample.doc',
      },
      document_type: 'file',
      user_access: null
    };
    var file = __dirname + '/samples/office-file.docx';
    var hydraterToWait = env.hydraters.office;
    var hydratedDocument = null;

    helpers.sendDocumentAndFileAndWaitForHydration.call(this, payload, file, hydraterToWait, function(document) {
      hydratedDocument = document;
    });

    it('should have been properly hydrated', function(done) {
      // Real test.
      hydratedDocument.data.html.should.containDeep('<!DOCTYPE html>');
      hydratedDocument.data.html.should.containDeep('Base CSS for pdf2htmlEX');
      hydratedDocument.metadata.text.should.containDeep('Matthieu BACCONNIER');
      done();
    });
  });

  describe("should work for image documents", function() {
    var payload = {
      identifier: env.apiUrl + '/test-image-dependencies-identifier',
      metadata: {
        path: '/test-dependencies-photo.jpg',
      },
      document_type: 'file',
      user_access: null
    };
    var file = __dirname + '/samples/image.jpg';
    var hydratersToWait = [env.hydraters.iptc, env.hydraters.image, env.hydraters.ocr];
    var hydratedDocument = null;

    helpers.sendDocumentAndFileAndWaitForHydration.call(this, payload, file, hydratersToWait, function(document) {
      hydratedDocument = document;
    });

    it('should have been properly hydrated', function(done) {
      hydratedDocument.should.have.property('document_type').and.have.property('id', '5252ce4ce4cfcd16f55cfa3d');
      hydratedDocument.should.have.property('metadata');
      hydratedDocument.metadata.should.have.property('author', 'Frédéric RUAUDEL');
      hydratedDocument.metadata.should.have.property('description', '© 2010 Frédéric Ruaudel, All Rights Reserved');
      hydratedDocument.metadata.should.have.property('keywords', '500px, Adulte, Blog FR, Fotografar2014, Homme, Personne, Xavier Bernard, iPhoto');
      hydratedDocument.data.should.have.property('display');
      hydratedDocument.data.should.have.property('thumb');
      hydratedDocument.should.have.property('hydrated_by');
      hydratersToWait.forEach(function(hydraterToWait) {
        hydratedDocument.hydrated_by.should.containEql(hydraterToWait + "/hydrate");
      });

      done();
    });
  });

  describe("should hydrate attachments", function() {
    var payload = {
      identifier: env.apiUrl + '/test-eml-identifier',
      metadata: {
        path: '/test-dependencies-sample.eml',
      },
      document_type: 'file',
      user_access: null
    };
    var file = __dirname + '/samples/eml-with-attachment.eml';
    var hydraterToWait = env.hydraters.eml;

    helpers.sendDocumentAndFileAndWaitForHydration.call(this, payload, file, hydraterToWait);

    it('should have been properly hydrated', function(done) {
      // Real test.
      helpers.basicApiRequest('get', '/documents/identifier/' + encodeURIComponent(payload.identifier + '/CV.docx'))
        .expect(200)
        .expect(function(res) {
          res.body.related.should.containDeep([{
            identifier: payload.identifier
          }]);
        })
        .end(done);
    });
  });

  describe("should work for ics documents", function() {
    var payload = {
      identifier: env.apiUrl + '/test-ics-identifier',
      metadata: {
        path: '/calendar.ics',
      },
      document_type: 'file',
      user_access: null
    };
    var file = __dirname + '/samples/calendar.ics';

    helpers.sendDocumentAndFile.call(this, payload, file);

    it('should have created three events', function(done) {
      function checkEvents(tryAgain) {
        helpers.basicApiRequest('get', '/documents?search=Node&document_type=5252ce4ce4cfcd16f55cfa40')
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          if(res.body.count === 3) {
            return done();
          }
          else if(res.body.count > 3) {
            return done(new Error("Too many documents matching!"));
          }
          else {
            return tryAgain();
          }
        });
      }

      helpers.wait(checkEvents);
    });

    it('should have been properly removed', function(done) {
      function checkHydration(tryAgain) {
        helpers.basicApiRequest('get', '/documents/identifier/' + encodeURIComponent(payload.identifier) + '/raw')
        .end(function(err, res) {
          if(err) {
            done(err);
          }
          else if(res.statusCode === 404) {
            done();
          }
          else {
            tryAgain();
          }
        });
      }
      helpers.wait(checkHydration);
    });
  });

  describe("should remove useless files", function() {
    var payload = {
      identifier: env.apiUrl + '/test-filecleaner-identifier',
      metadata: {
        path: '/test-filecleaner.DS_STORE',
      },
      document_type: 'file',
      user_access: null
    };
    var file = __dirname + '/samples/.DS_STORE';

    helpers.sendDocumentAndFile.call(this, payload, file);

    it('should have been properly removed', function(done) {
      function checkHydration(tryAgain) {
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
            tryAgain();
          }
        });
      }

      helpers.wait(checkHydration);
    });
  });
});