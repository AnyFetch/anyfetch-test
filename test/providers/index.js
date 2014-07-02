'use strict';

require('should');
var request = require('supertest');
var async = require('async');

var providers = [
  'http://dropbox.provider.anyfetch.com',
  'http://gmail.provider.anyfetch.com',
  'http://gcontacts.provider.anyfetch.com',
  'http://gdrive.provider.anyfetch.com',
];

describe("Test providers", function() {
  describe("are up", function() {
    providers.forEach(function(url) {
      async.retry(3, function(cb) {
        it("`" + url + "` should be up", function() {
          request(url)
            .post('/update')
            .expect(409)
            .end(cb);
        });
      });
    });
  });
});
