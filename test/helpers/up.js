"use strict";

var request = require('supertest');
var urlParser = require("url").parse;
var async = require("async");

/**
 * Return an object containing the status for each URL, or 'pending'
 * Url must be an array.
 */
module.exports.areUp = function isUp(urls) {
  var ret = {};

  async.map(urls, function(url, cb) {
    var components = urlParser(url);

    request(components.protocol + "//" + components.hostname)
      .get(components.path)
      .end(function(err, res) {
        ret[url] = err || res.statusCode;
        cb();
      });
  });

  return ret;
};


/**
 * Generate a "describe" checking specified hosts are up, using a parallel code to check for status
 */
module.exports.generateDescribe = function(hosts) {
  var urls = Object.keys(hosts).map(function(host) {
    return hosts[host].url;
  });

  var status = module.exports.areUp(urls);

  describe("are up", function() {
    Object.keys(hosts).forEach(function(host) {
      it("`" + host + "` should be up", function(done) {
        // Return true when done() has been called
        var checker = function checker() {
          if(status[hosts[host].url]) {
            var res = status[hosts[host].url];
            if(res === hosts[host].expected) {
              done();
              return true;
            }
            else if(res instanceof Error) {
              done(res);
              return true;
            }
            else {
              done(new Error("Unexpected status code, got " + res + ", expected " + hosts[host].expected));
              return true;
            }
          }

          return false;
        };

        if(!checker()) {
          var interval = setInterval(function() {
            if(checker()) {
              clearInterval(interval);
            }
          }, 25);
        }
      });
    });
  });
};
