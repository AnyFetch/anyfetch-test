'use strict';

var request = require('supertest');
var async = require('async');

var config = require('./config.js');

before(function createUserCredential(done) {
  async.waterfall([
    function createUser(cb) {
      var timestamp = (new Date()).getTime();

      request(config.apiUrl)
      .post('/users')
      .set('Authorization', 'Basic ' + config.masterCredential)
      .send({
        "email": "test-" + timestamp + "@anyfetch.com",
        "name": "test-" + timestamp,
        "password": "test_password",
        "is_admin": false
      })
      .end(cb);
    },
    function createSubcompanyAndUpdateCredential(res, cb) {
      config.basicCredential = (new Buffer(res.body.email + ":test_password")).toString('base64');

      request(config.apiUrl)
      .post('/subcompanies')
      .set('Authorization', 'Basic ' + config.masterCredential)
      .send({
        "user": res.body.id,
        "name": "test-company-" + (new Date()).getTime(),
      })
      .end(cb);
    },
    function saveSubcompanyId(res, cb) {
      config.subcompany_id = res.body.id;
      cb();
    }
  ], done);
});


after(function deleteSubcompany(done) {
  request(config.apiUrl)
  .del('/subcompanies/' + config.subcompany_id)
  .set('Authorization', 'Basic ' + config.masterCredential)
  .end(done);
});