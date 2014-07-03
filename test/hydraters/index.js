'use strict';

require('should');
var request = require('supertest');
var async = require('async');

var env = require('../env');

// Build a checker-function to compare a reply with a file
var generateCompareFunction = function(file) {
  return function(data, done) {
    require(file).should.eql(data);

    done();
  };
};

var hydraters = {};

hydraters[env.hydraters.plaintext] = {
  payload: {
    file_path: "https://raw2.github.com/AnyFetch/anyfetch-test/cb808057f26562bec2e10975cbe7950a3a6bb6b0/test/hydraters/samples/plaintext.hydrater.anyfetch.com.test.doc",
    long_poll: 1,
    document: {
      document_type: "file",
      metadata: {},
      data: {},
      identifier: 'plaintext-test'
    }
  },
  expected: generateCompareFunction('./samples/plaintext.hydrater.anyfetch.com.expected.json')
};

hydraters[env.hydraters.pdf] = {
  payload: {
    file_path: "https://raw2.github.com/AnyFetch/anyfetch-test/2ac40f1b80fde346ee25b33b51240e2987a10c84/test/hydraters/samples/pdf.hydrater.anyfetch.com.test.pdf",
    long_poll: 1,
    document: {
      document_type: 'document',
      metadata: {
        path: 'pdf.hydrater.anyfetch.com.test.pdf',
        mime_type: 'application/pdf'
      },
      data: {},
      identifier: 'pdf-test'
    }
  },
  expected: function(data, done) {
    var expected = require('./samples/pdf.hydrater.anyfetch.com.expected.json');
    for(var key in expected) {
      data.should.have.property(key);
      data[key].should.eql(expected[key]);
    }
    data.data.should.have.property('html');
    data.data.html.should.match(/mail est un/);
    done();
  }
};

hydraters[env.hydraters.office] = {
  payload: {
    access_token: "123",
    file_path: "https://raw2.github.com/AnyFetch/anyfetch-test/cb808057f26562bec2e10975cbe7950a3a6bb6b0/test/hydraters/samples/office.hydrater.anyfetch.com.test.doc",
    long_poll: 1,
    document: {
      document_type: 'document',
      metadata: {
        path: 'office.hydrater.anyfetch.com.test.doc'
      },
      data: {},
      identifier: 'office-test'
    }
  }
};

hydraters[env.hydraters.image] = {
  payload: {
    file_path: "https://raw2.github.com/AnyFetch/anyfetch-test/cb808057f26562bec2e10975cbe7950a3a6bb6b0/test/hydraters/samples/image.hydrater.anyfetch.com.test.png",
    long_poll: 1,
    document: {
      document_type: 'file',
      metadata: {
        path: 'image.hydrater.anyfetch.com.test.png',
      },
      data: {},
      identifier: 'image-test'
    }
  },
  expected: function(data, done) {
    var expected = require('./samples/image.hydrater.anyfetch.com.expected.json');
    for(var key in expected) {
      data.should.have.property(key);
      data[key].should.eql(expected[key]);
    }
    data.data.should.have.property('thumb');
    data.data.should.have.property('display');
    data.data.display.should.containDeep("data:image/jpeg;base64,");
    data.data.thumb.should.containDeep("data:image/png;base64,");
    done();
  }
};

hydraters[env.hydraters.ocr] = {
  payload: {
    file_path: "https://raw2.github.com/AnyFetch/anyfetch-test/cb808057f26562bec2e10975cbe7950a3a6bb6b0/test/hydraters/samples/ocr.hydrater.anyfetch.com.test.png",
    long_poll: 1,
    document: {
      document_type: 'image',
      metadata: {
        path: 'ocr.hydrater.anyfetch.com.test.png',
      },
      data: {},
      identifier: 'ocr-test'
    }
  },
  expected: generateCompareFunction('./samples/ocr.hydrater.anyfetch.com.expected.json')
};

hydraters[env.hydraters.eml] = {
  payload: {
    access_token: "123",
    file_path: "https://raw2.github.com/AnyFetch/anyfetch-test/2ac40f1b80fde346ee25b33b51240e2987a10c84/test/hydraters/samples/eml.hydrater.anyfetch.com.test.eml",
    long_poll: 1,
    document: {
      document_type: 'document',
      metadata: {
        path: '/file.eml'
      },
      data: {},
      identifier: 'eml-test'
    }
  },
  expected: generateCompareFunction('./samples/eml.hydrater.anyfetch.com.expected.json')
};

hydraters[env.hydraters.markdown] = {
  payload: {
    file_path: "https://raw2.github.com/AnyFetch/anyfetch-test/25a82595891eba0979ec4d4283e99258dfaeef88/test/hydraters/samples/markdown.hydrater.anyfetch.com.test.md",
    long_poll: 1,
    document: {
      document_type: 'document',
      metadata: {
        path: '/markdown.hydrater.anyfetch.com.test.md',
      },
      data: {},
      identifier: 'markdown-test'
    }
  },
  expected: generateCompareFunction('./samples/markdown.hydrater.anyfetch.com.expected.json')
};

hydraters[env.hydraters.iptc] = {
  payload: {
    file_path: "https://raw.githubusercontent.com/AnyFetch/anyfetch-test/327eb029b969a820b04868d219c5f797238874b8/test/hydraters/samples/iptc.hydrater.anyfetch.com.test.jpg",
    long_poll: 1,
    document: {
      document_type: 'document',
      metadata: {
        path: '/iptc.hydrater.anyfetch.com.test.jpg',
      },
      data: {},
      identifier: 'iptc-test'
    }
  },
  expected: generateCompareFunction('./samples/iptc.hydrater.anyfetch.com.expected.json')
};

hydraters[env.hydraters.filecleaner] = {};

describe("Test hydraters", function() {
  describe("are up", function() {
    Object.keys(hydraters).forEach(function(url) {
      it("`" + url + "` should be up", async.retry(3, function(cb) {
        request(url)
          .get('/status')
          .expect(200)
          .end(cb);
      }));
    });
  });

  describe("are working", function() {
    Object.keys(hydraters).forEach(function(url) {
      if(!hydraters[url].expected) {
        it("`" + url + "` should hydrate file");
        return;
      }

      it("`" + url + "` should hydrate file", async.retry(3, function(cb) {
        request(url)
          .post('/hydrate')
          .send(hydraters[url].payload)
          .expect(200)
          .end(function(err, res) {
            if(err) {
              return cb(err);
            }

            hydraters[url].expected(res.body, cb);
          });
      }));
    });
  });
});
