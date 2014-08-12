"use strict";
// Check hosts are up and available


var request = require('supertest');
var urlParser = require("url").parse;

var warmer = require('./warmer');

/**
 * Return an object containing the status for each URL, or 'pending'
 * Url must be an array.
 */
module.exports.areUp = function areUp(hosts) {
  var requests = {};

  Object.keys(hosts).map(function(host) {
    var url = hosts[host].url;

    var components = urlParser(url);

    requests[url] = request(components.protocol + "//" + components.hostname)
      .get(components.path)
      .expect(hosts[host].expected || 200);
  });

  var ret = warmer.prepareRequests(requests);
  return ret;
};


/**
 * Generate a "describe" checking specified hosts are up, using a parallel code to check for status
 */
module.exports.generateDescribe = function(hosts) {
  var status = module.exports.areUp(hosts);

  describe("are up", function() {
    Object.keys(hosts).forEach(function(host) {
      it("`" + host + "` should be up", function(done) {
        warmer.untilChecker(status, hosts[host].url, done);
      });
    });
  });
};
