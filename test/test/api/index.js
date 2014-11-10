'use strict';

require('should');

var helpers = require('../../helpers/api');

describe("Test common API usage", function() {
  before(helpers.reset);
  before(helpers.getToken);

  it("should be able to login", function(done) {
    // We should be able to login using supplied credentials
    helpers.basicApiRequest('get', '/')
      .expect(200)
      .end(done);
  });

  var payload = {
    identifier: 'test-workflow-identifier',
    metadata: {
      text: 'hello world',
      path: '/sample-path.txt'
    },
    document_type: 'document',
    user_access: null,
  };

  it("should be able to send a document", function(done) {
    // We should be able to login using supplied credentials
    helpers.tokenApiRequest('post', '/documents')
      .send(payload)
      .expect(helpers.expectJSON('identifier', payload.identifier))
      .expect(200)
      .end(function(err, res) {
        if(err) {
          throw err;
        }
        payload.id = res.body.id;

        done();
      });
  });

  it("should be able to retrieve a document", function(done) {
    // We should be able to get the document after providing
    helpers.basicApiRequest('get', '/documents/' + payload.id)
      .expect(200)
      .expect(function(res) {
        res.body.should.have.property('id', payload.id);
        res.body.should.have.property('data');
      })
      .expect(200)
      .end(done);
  });

  it("should be able to get an image representation of a document", function(done) {
    helpers.basicApiRequest('get', '/documents/' + payload.id + "/image")
      .expect(200)
      .expect('content-type', 'image/png')
      .end(done);
  });

  it("should be able to search for a document", function(done) {
    function checkExist(tryAgain) {
      // We should be able to get the document via ES
      helpers.basicApiRequest('get', '/documents?search=hello')
        // .expect(200) We can get a 500 when searching too fast after index initialisation (SearchPhaseExecutionException[Failed to execute phase [query_fetch], all shards failed), so we allow 500 and just use tryAgain() to make the query again at a later time
        .end(function(err, res) {
          if(err) {
            throw err;
          }
          if(!res.body.data || res.body.data.length === 0) {
            return tryAgain(new Error("Bad datas : " + JSON.stringify(res.body)));
          }

          res.body.should.have.property('data').with.lengthOf(1);
          res.body.data[0].should.have.property('id', payload.id);

          // Test projection is working too (title auto generated from path)
          res.body.data[0].data.should.have.property('title', 'sample-path');

          done();
        });
    }

    // Wait for ES indexing
    helpers.wait(checkExist);
  });

  it("should be removed with a reset", function(done) {
    helpers.basicApiRequest('del', '/company/reset')
    .expect(204)
    .end(function(err) {
      if(err) {
        throw err;
      }

      helpers.basicApiRequest('get', '/documents/' + payload.id)
        .expect(404)
        .end(done);
    });
  });
});
