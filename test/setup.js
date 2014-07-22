'use strict';

var request = require('supertest');
var async = require('async');

var env = require('./env');

var masterAuth = 'Basic ' + env.masterCredentials;
if(env.masterToken) {
  masterAuth = 'Bearer ' + env.masterToken;
}

before(function createUserCredential(done) {
  async.waterfall([
    function createUser(cb) {
      var timestamp = (new Date()).getTime();

      request(env.apiUrl)
        .post('/users')
        .set('Authorization', masterAuth)
        .send({
          "email": "test-" + timestamp + "@anyfetch.com",
          "name": "test-" + timestamp,
          "password": "test_password",
          "is_admin": false
        })
        .expect(200)
        .end(cb);
    },
    function createSubcompanyAndUpdateCredential(res, cb) {
      env.basicCredentials = (new Buffer(res.body.email + ":test_password")).toString('base64');
      request(env.apiUrl)
        .post('/subcompanies')
        .set('Authorization', masterAuth)
        .send({
          "user": res.body.id,
          "name": "test-company-" + (new Date()).getTime(),
        })
        .expect(200)
        .end(cb);
    },
    function saveSubcompanyId(res, cb) {
      env.subcompany_id = res.body.id;
      cb();
    }
  ], done);
});


after(function deleteSubcompany(done) {
  request(env.apiUrl)
    .del('/subcompanies/' + env.subcompany_id)
    .set('Authorization', masterAuth)
    .expect(204)
    .end(done);
});
