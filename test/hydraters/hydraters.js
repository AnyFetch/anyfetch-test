'use strict';

require('should');
var request = require('supertest');


// Build a checker-function to compare a reply with a file
var generateCompareFunction = function(file) {
  return function(res, done) {
    require(file).should.eql(res);

    done();
  };
};

var hydraters = {
  'http://plaintext.hydrater.anyfetch.com': {
    payload: {
      file_path: "https://raw2.github.com/Papiel/anyfetch-test/cb808057f26562bec2e10975cbe7950a3a6bb6b0/test/hydraters/samples/plaintext.hydrater.anyfetch.com.test.doc",
      long_poll: 1,
      document: {
        document_type: "file",
        metadatas: {},
        datas: {},
        identifier: 'plaintext-test'
      }
    },
    expected: generateCompareFunction('./samples/plaintext.hydrater.anyfetch.com.expected.json')
  },
  'http://pdf.hydrater.anyfetch.com': {
    payload: {
      file_path: "https://raw2.github.com/Papiel/anyfetch-test/cb808057f26562bec2e10975cbe7950a3a6bb6b0/test/hydraters/samples/pdf.hydrater.anyfetch.com.test.pdf",
      long_poll: 1,
      document: {
        document_type: 'document',
        metadatas: {
          path: 'pdf.hydrater.anyfetch.com.test.pdf',
          mime_type: 'application/pdf'
        },
        datas: {},
        identifier: 'pdf-test'
      }
    }
  },
  'http://office.hydrater.anyfetch.com': {
    payload: {
      access_token: "123",
      file_path: "https://raw2.github.com/Papiel/anyfetch-test/cb808057f26562bec2e10975cbe7950a3a6bb6b0/test/hydraters/samples/office.hydrater.anyfetch.com.test.doc",
      long_poll: 1,
      document: {
        document_type: 'document',
        metadatas: {
          path: 'office.hydrater.anyfetch.com.test.doc'
        },
        datas: {},
        identifier: 'office-test'
      }
    }
  },
  'http://image.hydrater.anyfetch.com': {
    payload: {
      file_path: "https://raw2.github.com/Papiel/anyfetch-test/cb808057f26562bec2e10975cbe7950a3a6bb6b0/test/hydraters/samples/image.hydrater.anyfetch.com.test.png",
      long_poll: 1,
      example: {
        document_type: 'file',
        metadatas: {},
        datas: {},
        identifier: 'image-test'
      }
    }
  },
  'http://ocr.hydrater.anyfetch.com': {
    payload: {
      file_path: "https://raw2.github.com/Papiel/anyfetch-test/cb808057f26562bec2e10975cbe7950a3a6bb6b0/test/hydraters/samples/ocr.hydrater.anyfetch.com.test.png",
      long_poll: 1,
      document: {
        document_type: 'image',
        metadatas: {},
        datas: {},
        identifier: 'ocr-test'
      }
    }
  },
  'http://eml.hydrater.anyfetch.com': {
    payload: {
      access_token: "321",
      file_path: "https://raw2.github.com/Papiel/anyfetch-test/cb808057f26562bec2e10975cbe7950a3a6bb6b0/test/hydraters/samples/eml.hydrater.anyfetch.com.test.eml",
      long_poll: 1,
      document: {
        document_type: 'document',
        metadatas: {
          path: '/file.eml'
        },
        datas: {},
        identifier: 'eml-test'
      }
    }
  },
};

describe("Test hydraters", function() {
  describe.skip("are up", function() {
    Object.keys(hydraters).forEach(function(url) {
      it("`" + url + "` should be up", function(done) {
        request(url)
          .get('/status')
          .expect(200)
          .end(done);
      });
    });
  });

  describe("are working", function() {
    Object.keys(hydraters).forEach(function(url) {
      if(!hydraters[url].expected) {
        return;
      }

      it("`" + url + "` should hydrate file", function(done) {
        request(url)
          .post('/hydrate')
          .send(hydraters[url].payload)
          .expect(200)
          .end(function(err, res) {
            if(err) {
              throw err;
            }

            hydraters[url].expected(res.body, done);
          });
      });
    });
  });
});
