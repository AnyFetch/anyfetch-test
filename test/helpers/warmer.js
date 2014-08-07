"use strict";
// Execute requests before any "it", ensuring they'll be ready and done when mocha comes.


var async = require("async");

/**
 * Return an object containing the status for each URL, or 'pending'
 * Url must be an array.
 */
module.exports.prepareRequests = function prepareRequests(requests) {
  var ret = {};

  async.map(Object.keys(requests), function(url, cb) {
    var req = requests[url];
    req.end(function() {
      ret[url] = arguments;
      cb();
    });
  });

  return ret;
};


/**
 * Call cb() with the results from the request made with prepareRequests
 */
module.exports.untilChecker = function untilChecker(ret, key, cb) {
  // Return true when done() has been called
  var checker = function checker() {
    if(ret[key]) {
      cb.apply(this, ret[key]);
      return true;
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
};
