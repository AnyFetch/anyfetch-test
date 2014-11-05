'use strict';

require('should');
var request = require('supertest');

var up = require('../../helpers/up');
var warmer = require('../../helpers/warmer');
var env = require('../../../config');

// Build a checker-function to compare a reply with a file
var generateCompareFunction = function(file) {
  return function(data) {
    // Useful when updating expectation file
    // require('fs').writeFileSync(file, JSON.stringify(data, null, 2));
    require(file).should.eql(data);
  };
};

var hydraters = {};

hydraters[env.hydraters.plaintext] = {
  payload: {
    file_path: "https://raw.githubusercontent.com/AnyFetch/anyfetch-test/2de85126d2bc3e648ed199c84ec7a4e07a5f9392/test/test/hydraters/samples/plaintext.anyfetch.com.test.docx",
    long_poll: 1,
    document: {
      document_type: "file",
      metadata: {},
      data: {},
      identifier: 'plaintext-test'
    }
  },
  expected: generateCompareFunction('./samples/plaintext.anyfetch.com.expected.json')
};

hydraters[env.hydraters.pdf] = {
  payload: {
    file_path: "https://raw.githubusercontent.com/AnyFetch/anyfetch-test/2de85126d2bc3e648ed199c84ec7a4e07a5f9392/test/test/hydraters/samples/pdf.anyfetch.com.test.pdf",
    long_poll: 1,
    document: {
      document_type: 'document',
      metadata: {
        path: 'pdf.anyfetch.com.test.pdf',
        mime_type: 'application/pdf'
      },
      data: {},
      identifier: 'pdf-test'
    }
  },
  expected: function(data) {
    var expected = require('./samples/pdf.anyfetch.com.expected.json');
    for(var key in expected) {
      data.should.have.property(key);
      data[key].should.eql(expected[key]);
    }
    data.data.should.have.property('html');
    data.data.html.should.match(/mail est un/);
  }
};

hydraters[env.hydraters.office] = {
  payload: {}
};

hydraters[env.hydraters.image] = {
  payload: {
    file_path: "https://raw.githubusercontent.com/AnyFetch/anyfetch-test/2de85126d2bc3e648ed199c84ec7a4e07a5f9392/test/test/hydraters/samples/image.anyfetch.com.test.png",
    long_poll: 1,
    document: {
      document_type: 'file',
      metadata: {
        path: 'image.anyfetch.com.test.png',
      },
      data: {},
      identifier: 'image-test'
    }
  },
  expected: function(data) {
    var expected = require('./samples/image.anyfetch.com.expected.json');
    for(var key in expected) {
      data.should.have.property(key);
      data[key].should.eql(expected[key]);
    }
    data.metadata.should.have.property('thumb');
    data.metadata.thumb.should.containDeep("data:image/png;base64,");
    data.data.should.have.property('display');
    data.data.display.should.containDeep("data:image/jpeg;base64,");
  }
};

hydraters[env.hydraters.ocr] = {
  payload: {
    file_path: "https://raw.githubusercontent.com/AnyFetch/anyfetch-test/2de85126d2bc3e648ed199c84ec7a4e07a5f9392/test/test/hydraters/samples/ocr.anyfetch.com.test.png",
    long_poll: 1,
    document: {
      document_type: 'image',
      metadata: {
        path: 'ocr.anyfetch.com.test.png',
      },
      data: {},
      identifier: 'ocr-test'
    }
  },
  expected: generateCompareFunction('./samples/ocr.anyfetch.com.expected.json')
};

hydraters[env.hydraters.eml] = {
  payload: {
    access_token: "123",
    file_path: "https://raw.githubusercontent.com/AnyFetch/anyfetch-test/2de85126d2bc3e648ed199c84ec7a4e07a5f9392/test/test/hydraters/samples/eml.anyfetch.com.test.eml",
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
  expected: generateCompareFunction('./samples/eml.anyfetch.com.expected.json')
};

hydraters[env.hydraters.markdown] = {
  payload: {
    file_path: "https://raw.githubusercontent.com/AnyFetch/anyfetch-test/2de85126d2bc3e648ed199c84ec7a4e07a5f9392/test/test/hydraters/samples/markdown.anyfetch.com.test.md",
    long_poll: 1,
    document: {
      document_type: 'document',
      metadata: {
        path: '/markdown.anyfetch.com.test.md',
      },
      data: {},
      identifier: 'markdown-test'
    }
  },
  expected: generateCompareFunction('./samples/markdown.anyfetch.com.expected.json')
};

hydraters[env.hydraters.embedmail] = {
  payload: {
    long_poll: 1,
    document: {
      document_type: 'document',
      metadata: {
        text: 'Salut !\n----- forwarded message ------\nDe : buathi_q@epitech.eu....'
      },
      data: {},
      identifier: 'embedmail-test',
      id: 'embedmail-test'
    }
  },
  expected: generateCompareFunction('./samples/embedmail.anyfetch.com.expected.json')
};

hydraters[env.hydraters.iptc] = {
  payload: {
    file_path: "https://raw.githubusercontent.com/AnyFetch/anyfetch-test/2de85126d2bc3e648ed199c84ec7a4e07a5f9392/test/test/hydraters/samples/iptc.anyfetch.com.test.jpg",
    long_poll: 1,
    document: {
      document_type: 'document',
      metadata: {
        path: '/iptc.anyfetch.com.test.jpg',
      },
      data: {},
      identifier: 'iptc-test'
    }
  },
  expected: generateCompareFunction('./samples/iptc.anyfetch.com.expected.json')
};

hydraters[env.hydraters.deduplicator] = {
  payload: {},
};

hydraters[env.hydraters.ics] = {
  payload: {}
};

hydraters[env.hydraters.filecleaner] = {
  payload: {}
};


describe("Test hydraters", function() {
  var hosts = {};
  Object.keys(hydraters).forEach(function(url) {
    hosts[url] = {
      url: url + '/status',
      expected: 200
    };
  });
  up.generateDescribe(hosts);

  describe("are working", function() {
    var requests = {};
    Object.keys(hydraters).forEach(function(url) {
      if(!hydraters[url].expected) {
        // Skip hdyraters without expectation
        it("`" + url + "` should hydrate file");
        return;
      }

      requests[url] = request(url)
        .post('/hydrate')
        .send(hydraters[url].payload)
        .expect(200)
        .expect(function(res) {
          hydraters[url].expected(res.body);
        });
    });

    var status = warmer.prepareRequests(requests);

    Object.keys(requests).forEach(function(url) {
      it("`" + url + "` should hydrate file", function(done) {
        warmer.untilChecker(status, url, done);
      });
    });

  });
});
