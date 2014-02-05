'use strict';

require('should');

var helpers = require('./helpers.js');

describe.only("Test providers workflow", function() {
  before(helpers.createAccount);
  before(helpers.resetAccount);

  it("should be able to send a document", function(done) {
    // We should be able to login using supplied credentials
    helpers.basicApiRequest('post', '/providers/documents')
      .send({
        identifier:'test-identifier',
        metadatas: {
          path:'hello world'
        },
        document_type: 'file',
        user_access: null
      })
      .expect(helpers.expectJSON('name', 'test@anyfetch.com'))
      .expect(200)
      .end(done);
    done();
  });

  it("should be able to get a document", function(done) {

    helpers.tokenApiRequest('get', '/documents?search=hello', function(err, r) {
      r
      .expect(200)
      .end(function(err, res){
        if (err) {
          return done(err);
        }


        done();
      });
    });
  });

  after(helpers.deleteAccount);
});
