'use strict';

var request = require('supertest');
var async = require('async');

var env = require('../' + process.env.NODE_ENV + ".json");

before(function createUserCredential(done) {
  async.waterfall([
    function createUser(cb) {
      var timestamp = (new Date()).getTime();

      request(env.apiUrl)
      .post('/users')
      .set('Authorization', 'Basic ' + env.credentials)
      .send({
        "email": "test-" + timestamp + "@anyfetch.com",
        "name": "test-" + timestamp,
        "password": "test_password",
        "is_admin": false
      })
      .end(cb);
    },
    function createSubcompanyAndUpdateCredential(res, cb) {
      env.basicCredential = (new Buffer(res.body.email + ":test_password")).toString('base64');

      request(env.apiUrl)
      .post('/subcompanies')
      .set('Authorization', 'Basic ' + env.credentials)
      .send({
        "user": res.body.id,
        "name": "test-company-" + (new Date()).getTime(),
      })
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
  .set('Authorization', 'Basic ' + env.credentials)
  .end(done);
});