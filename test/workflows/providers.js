'use strict';

require('should');

var helpers = require('./helpers.js');

describe.only("Test providers workflow", function() {
  before(helpers.createAccount);
  before(helpers.getToken);

  var payload = {
    identifier:'test-identifier',
    metadatas: {
      path:'hello world'
    },
    document_type: 'file',
    user_access: null
  };

  it("should be able to send a document", function(done) {
    // We should be able to login using supplied credentials
    helpers.tokenApiRequest('post', '/providers/documents')
      .send(payload)
      .expect(helpers.expectJSON('identifier', payload.identifier))
      .expect(200)
      .end(function(err, res) {
        payload.id = res.body.id;
        done(err);
      });
  });

  it("should be able to get a document", function(done) {
    helpers.basicApiRequest('get', '/documents?search=hello')
      .expect(function(res){
        res.body.datas[0].should.have.property('id', payload.id);
      })
      .expect(200)
      .end(done);
  });

  after(helpers.deleteAccount);
});
