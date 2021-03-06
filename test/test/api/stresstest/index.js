'use strict';

require('should');
var async = require('async');

var helpers = require('../../../helpers/api');

var env = require('../../../../config');

var COUNT = process.env.STRESSTEST || 8;

describe("Stress test", function() {
  // Increase timeout for this test
  this.timeout(Math.max(20000, COUNT * 15000));

  before(helpers.reset);
  before(helpers.getToken);

  // Generate a simple range to iterate over
  var range = [];
  for(var i = 0; i < COUNT; i += 1) {
    range.push(i);
  }

  // Store all documents sent
  var payloads = new Array(COUNT);

  it("sending " + COUNT + " documents and files", function(done) {
    var sender = function(i, cb) {
      var payload = {
        identifier: 'test-office-dependencies-identifier-' + i,
        document_type: 'file',
        metadata: {
          title: 'bar' + i
        },
        user_access: null
      };
      payloads[i] = payload;
      var file = __dirname + '/../workflows/samples/office-file.docx';

      async.series([
        helpers.sendDocument(payload),
        helpers.sendFile(payload, file)
      ], cb);
    };


    async.eachLimit(range, 8, sender, done);
  });

  it("checking for hydration", function(done) {
    var checker = function(i, cb) {
      var id = payloads[i].id;

      helpers.waitForHydration(id, env.hydraters.office)(cb);
    };

    async.eachLimit(range, 8, checker, done);
  });
});
