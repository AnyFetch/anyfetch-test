'use strict';

require('should');
var request = require('supertest');

describe("Test hydraters", function() {
  var hydraters = ['http://plaintext.hydrater.anyfetch.com', 'http://pdf.hydrater.anyfetch.com', 'http://office.hydrater.anyfetch.com', 'http://image.hydrater.anyfetch.com', 'http://ocr.hydrater.anyfetch.com', 'http://eml.hydrater.anyfetch.com'];

  describe("are up", function() {
    hydraters.forEach(function(url) {
      it("`" + url + "` should be up", function(done) {
        request(url)
          .get('/status')
          .expect(200)
          .end(done);
      });
    });
  });

  describe.skip("are working", function() {
  });
});
