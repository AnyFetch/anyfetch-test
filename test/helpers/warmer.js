"use strict";
// Execute requests before any "it", ensuring they'll be ready and done when mocha comes.
// This way, we can get some parallel-sugar instead of waiting in series.


var async = require("async");


/**
 * Return an object containing the status for each URL.
 * The key will only appear when the request is done.
 * Use `untilChecker` to poll the object until the file appears.
 * requests mut be an object, key is the url (which will be later reused in the result) and value the request to execute (without the .end())
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
      // Wrap in process.nextTick to avoid weird concurrency issues
      process.nextTick(function() {
        cb.apply(this, ret[key]);
      });
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
