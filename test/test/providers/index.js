'use strict';

require('should');

var async = require('async');
var Nightmare = require('nightmare');

var up = require('../../helpers/up');
var api = require('../../helpers/api');
var env = require('../../../config');

var managerNightmare = require('../../helpers/nightmare/manager');
var googleNightmare = require('../../helpers/nightmare/google');
var dropboxNightmare = require('../../helpers/nightmare/dropbox');
var evernoteNightmare = require('../../helpers/nightmare/evernote');

var providers = {};

providers[env.providers.gcontacts] = {
  id: '52bff1eec8318cb228000001',
  workflow: function (nightmare) {
    nightmare
      .use(googleNightmare.login(process.env.GOOGLE_EMAIL, process.env.GOOGLE_PASSWORD))
      .use(googleNightmare.authorize());
  }
};

providers[env.providers.gmail] = {
  id: '53047faac8318c2d65000096',
  workflow: function (nightmare) {
    nightmare
      .use(googleNightmare.login(process.env.GOOGLE_EMAIL, process.env.GOOGLE_PASSWORD))
      .use(googleNightmare.authorize());
  }
};

providers[env.providers.gdrive] = {
  id: '539ef7289f240405465a2e1f',
  workflow: function (nightmare) {
    nightmare
      .use(googleNightmare.login(process.env.GOOGLE_EMAIL, process.env.GOOGLE_PASSWORD))
      .use(googleNightmare.authorize());
  }
};

providers[env.providers.gcalendar] = {
  id: '53047faac8318c2d65000099',
  workflow: function (nightmare) {
    nightmare
      .use(googleNightmare.login(process.env.GOOGLE_EMAIL, process.env.GOOGLE_PASSWORD))
      .use(googleNightmare.authorize());
  }
};

providers[env.providers.dropbox] = {
  id: '52bff114c8318c29e9000005',
  workflow: function (nightmare) {
    nightmare
      .use(dropboxNightmare.login(process.env.GOOGLE_EMAIL, process.env.GOOGLE_PASSWORD))
      .use(dropboxNightmare.authorize());
  }
};

providers[env.providers.evernote] = {
  id: '53047faac8318c2d65000097',
  workflow: function (nightmare) {
    nightmare
      .use(evernoteNightmare.login(process.env.EVERNOTE_EMAIL, process.env.EVERNOTE_PASSWORD))
      .use(evernoteNightmare.authorize());
  }
};

/*providers[env.providers.salesforce] = {
  id: '53047faac8318c2d65000100',
  workflow: function (nightmare) {
    // TO-DO
  }
};*/

describe("Test providers", function() {
  var hosts = {};
  Object.keys(env.providers).forEach(function(provider) {
    provider = env.providers[provider];
    hosts[provider] = {
      url: provider,
      expected: 302,
    };
  });

  up.generateDescribe(hosts);

  describe("are working", function() {
    Object.keys(providers).forEach(function(url) {
      describe(url, function() {
        before(api.getToken);

        it('should can be connected', function(done) {
         this.timeout(30000);

         new Nightmare()
            .viewport(800, 600)
            .use(managerNightmare.connect(providers[url].id))
            .use(providers[url].workflow)
            .wait('.alert')
            .run(done);
        });

        it('should have create an access_token', function(done) {
          async.waterfall([
            function getProviders(cb) {
              api
                .basicApiRequest('get', '/providers')
                .end(function(err, res) {
                  cb(err, res ? res.body : []);
                });
            },
            function checkProviders(accountProviders, cb) {
              if(!accountProviders.some(function(provider) { return provider.client && provider.client.id === providers[url].id; })) {
                return cb(new Error("Connect haven't create a new access_token"));
              }
              cb(null);
            }
          ], done);
        });

        after(api.reset);
      });
    });
  });
});
