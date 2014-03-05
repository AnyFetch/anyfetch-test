'use strict';

require('should');
var request = require('supertest');

var url = 'http://anyfetch.com';
var staging_url = 'http://anyfetch.com';

describe("Test frontend", function() {
  it("`" + url + "` should be up", function(done) {
    request(url)
      .get('/')
      .expect(200)
      .end(done);
  });

  it("`" + staging_url + "` should be up", function(done) {
    request(staging_url)
      .get('/')
      .expect(200)
      .end(done);
  });
});
