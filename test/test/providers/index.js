'use strict';

require('should');

var up = require('../../helpers/up');
var env = require('../../../config');


describe("Test providers", function() {
  var hosts = {};
  Object.keys(env.providers).forEach(function(provider) {
    provider = env.providers[provider];
    hosts[provider] = {
      url: provider,
      expected: 302,
    };
  });

  up.generateDescribe(hosts);
});
