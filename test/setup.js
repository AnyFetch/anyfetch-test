'use strict';

var request = require('supertest');
var async = require('async');

var env = require('../config');

var masterAuth = 'Basic ' + env.masterCredentials;
if(env.masterToken) {
  masterAuth = 'Bearer ' + env.masterToken;
}

before(function createUserCredential(done) {
  this.timestamp = (new Date()).getTime();
  this.email = "test-" + this.timestamp + "@anyfetch.com";
  this.name = "test-" + this.timestamp;
  this.password = "test_password";
  var self = this;

  async.waterfall([
    function createUser(cb) {

      request(env.apiUrl)
        .post('/users')
        .set('Authorization', masterAuth)
        .send({
          "email": self.email,
          "name": self.name,
          "password": self.password,
          "is_admin": false
        })
        .expect(200)
        .end(cb);
    },
    function createSubcompanyAndUpdateCredential(res, cb) {
      env.basicCredentials = (new Buffer(self.email + ":" + self.password)).toString('base64');
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
