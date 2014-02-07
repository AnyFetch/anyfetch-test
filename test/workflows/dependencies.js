'use strict';

require('should');

var helpers = require('./helpers.js');

describe("Test providers workflow", function() {
  before(helpers.createAccount);
  before(helpers.resetAccount);
  before(helpers.getToken);

  it("should work for office documents");
  it("should work for eml with attachments");

  after(helpers.deleteAccount);
});
