'use strict';

require('should');
require('longjohn');

var async = require('async');
var helpers = require('./helpers.js');

describe.only("Test hydraters dependencies", function() {
  before(helpers.createAccount);
  before(helpers.resetAccount);
  before(helpers.getToken);

  it("should work for office documents", function(done) {
    var payload = {
      no_hydration: true,
      identifier:'test-dependencies-identifier',
      metadatas: {
        path: '/test-dependencies-sample.doc',
      },
      document_type: 'file',
      user_access: null
    };

    async.series([
      function sendDocument(cb) {
        helpers.tokenApiRequest('post', '/providers/documents')
          .send(payload)
          .expect(200)
          .end(function(err, res) {
            if(err) {
              throw err;
            }

            payload.id = res.body.id;

            cb();
          });
      },
      function sendFile(cb) {
        helpers.tokenApiRequest('post', '/providers/documents/file')
          .field('identifier', payload.identifier)
          .attach('file', __dirname + '/../hydraters/samples/office.hydrater.anyfetch.com.test.doc')
          .expect(204)
          .end(cb);
      },
      function waitForHydration(cb) {
        var retry = setInterval(function() {
          helpers.tokenApiRequest('get', '/documents/' + payload.id + "/raw")
          .expect(200)
          .expect(function(res) {
            if(res.body.hydrated_by.indexOf('http://office.hydrater.anyfetch.com/hydrate') !== -1) {
              // Office hydraters completed!
              // We can now finish the test.
              clearInterval(retry);

              res.body.datas.content.should.include('pers<span class="_ _1"></span>onnalité</div><div class="t m0 x5 h4 yc ff3 fs1 fc0 sc0 ls0 ws0">juridique)');
              return cb();
            }
          })
          .end(function(err) {
            // Do nothing and retry.
            if(err) {
              throw err;
            }
          });
        }, 1000);
      },
    ], done);
  });

  it("should work for eml with attachments");

  after(helpers.deleteAccount);
});
