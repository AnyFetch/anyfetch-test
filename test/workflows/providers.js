'use strict';

require('should');

var helpers = require('./helpers.js');

describe.only("Test providers workflow", function() {
  before(helpers.createAccount);
  before(helpers.resetAccount);

  it("should be able to send a document", function(done) {
    // We should be able to login using supplied credentials
    // helpers.apiRequest('post', '/providers/documents')
    //   .send({
    //     identifier:'test-identifier',
    //     metadatas: {
    //       path:'hello world'
    //     },
    //     document_type: 'file',
    //     user_access: null
    //   })
    //   .expect(helpers.expectJSON('name', 'test@anyfetch.com'))
    //   .end(function(err, res) {
    //     console.log(res.body);
    //     done(err);
    //   });
    done();
  });

  after(helpers.deleteAccount);
});
