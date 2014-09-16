'use strict';

require('should');

var async = require('async');
var helpers = require('../../../helpers/api');
var warmer = require('../../../helpers/warmer');

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

  describe("should work for duplicate document", function() {
    var docs = [{
      identifier: 'test-deduplicator-1',
      metadata: {
        foo: 'bar'
      },
      document_type: 'document',
      user_access: null
    },
    {
      identifier: 'test-deduplicator-2',
      metadata: {
        foo: 'bar'
      },
      document_type: 'document',
      user_access: null
    },
    {
      identifier: 'test-deduplicator-3',
      metadata: {
        foo: 'bar'
      },
      document_type: 'document',
      user_access: null
    }];

    var documentWarmer;
    this.parent.beforeAll.call(this.parent, function(done) {
      documentWarmer = warmer.prepareRequests({
        document: module.exports.buildDocumentRequest(docs[0])
      });

      warmer.untilChecker(documentWarmer, 'document', function(err) {
        documentWarmer.documentErr = err;
      });

      // Call done directly, without waiting for any return
      done();
    });

    before(function(done) {
      done(documentWarmer.documentErr);
    });

    it('should have created one document with a hash', function(done) {
      function checkDoc1(tryAgain) {
        helpers.basicApiRequest('get', '/documents/identifier/test-deduplicator-1/raw')
        .end(function(err, res) {
          if(err) {
            return done(err);
          }

          if(res.statusCode === 404 || res.body.hydrating.length !== 0) {
            return tryAgain();
          }

          res.body.should.have.property('metadata');
          res.body.metadata.should.have.property('hash', 'a5e744d0164540d33b1d7ea616c28f2fa97e754a');
          done();
        });
      }

      helpers.wait(checkDoc1);
    });

    it('should have properly remove doc1 and doc2', function(done) {
      function waitHydration(identifier, cb) {
        return function(tryAgain) {
          helpers.basicApiRequest('get', '/documents/identifier/' + identifier + '/raw')
          .end(function(err, res) {
            if(err) {
              return cb(err);
            }

            if(res.statusCode === 404 || res.body.hydrating.length !== 0) {
              return tryAgain();
            }

            cb();
          });
        };
      }

      function checkDeleted(identifier, cb) {
        helpers.basicApiRequest('get', '/documents/identifier/' + identifier)
        .end(function(err, res) {
          if(err) {
            return cb(err);
          }

          if(res.status.code !== 404) {
            cb(new Error('Document ' + identifier + ' must be removed after deduplicator hydration'));
          }

          cb();
        });
      }

      delete docs[0];
      async.waterfall([
        function sendDocuments(cb) {
          async.eachSeries(docs, function sendDocument(doc, cb) {
            helpers.sendDocument(doc)(function(err) {
              if(err) {
                return cb(err);
              }

              helpers.wait(waitHydration(doc.identifier, cb));
            });
          }, cb);
        },
        function checkDeletedDoc1(cb) {
          checkDeleted('test-deduplicator-1', cb);
        },
        function checkDeletedDoc2(cb) {
          checkDeleted('test-deduplicator-2', cb);
        }
      ], done);
    });
  });
});
