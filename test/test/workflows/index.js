'use strict';

require('should');

var helpers = require('../../helpers/api');

describe("Test workflow", function() {
  it("should be able to login", function(done) {
    // We should be able to login using supplied credentials
    helpers.basicApiRequest('get', '/')
      .expect(200)
      .end(done);
  });
});
