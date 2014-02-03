'use strict';

require('should');
var request = require('supertest');

var url = 'http://anyfetch.com';

describe.only("Test frontend", function() {
  it("`" + url + "` should be up", function(done) {
    request(url)
      .get('/')
      .expect(200)
      .end(done);
  });
});
