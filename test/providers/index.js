var providers = [
  'http://dropbox.provider.anyfetch.com'  
  'http://gmail.provider.anyfetch.com'  
  'http://gcontacts.provider.anyfetch.com'  
]

describe("Test hydraters", function() {
  describe("are up", function() {
    Object.keys(hydraters).forEach(function(url) {
      it("`" + url + "` should be up", function(done) {
        request(url)
          .get('/status')
          .expect(200)
          .end(done);
      });
    });
  });
