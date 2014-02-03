'use strict';

require('should');
var request = require('supertest');

var providers = [
  'http://dropbox.provider.anyfetch.com',
  'http://gmail.provider.anyfetch.com',
  'http://gcontacts.provider.anyfetch.com',
];

describe("Test providers", function() {
  describe("are up", function() {
    providers.forEach(function(url) {
      it("`" + url + "` should be up", function(done) {
        request(url)
          .get('/update')
          .expect(405)
          .end(done);
      });
    });
  });
});
