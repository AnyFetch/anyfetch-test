'use strict';

require('should');
var request = require('supertest');

var helpers = require('./helpers.js');

describe("Test providers workflow", function() {
  before(helpers.createAccount);
  before(helpers.resetAccount);
  after(helpers.deleteAccount);
});
