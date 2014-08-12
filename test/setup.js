'use strict';

var request = require('supertest');
var async = require('async');

var env = require('../config');

var masterAuth = 'Basic ' + env.masterCredentials;
if(env.masterToken) {
  masterAuth = 'Bearer ' + env.masterToken;
}

before(function createUserCredential(done) {
  env.credentials = {};

  env.credentials.timestamp = (new Date()).getTime();
  env.credentials.email = "test-" + env.credentials.timestamp + "@anyfetch.com";
  env.credentials.name = "test-" + env.credentials.timestamp;
  env.credentials.password = "test_password";

  async.waterfall([
    function createUser(cb) {

      request(env.apiUrl)
        .post('/users')
        .set('Authorization', masterAuth)
        .send({
          "email": env.credentials.email,
          "name": env.credentials.name,
          "password": env.credentials.password,
          "is_admin": false
        })
        .expect(200)
        .end(cb);
    },
    function createSubcompanyAndUpdateCredential(res, cb) {
      env.credentials.basic = (new Buffer(env.credentials.email + ":" + env.credentials.password)).toString('base64');
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
    },
  ], done);
});


after(function deleteSubcompany(done) {
  request(env.apiUrl)
    .del('/subcompanies/' + env.subcompany_id)
    .set('Authorization', masterAuth)
    .expect(204)
    .end(done);
});


var http = require('http');
var https = require('https');

// See max socket value, default is 5.
// See http://markdawson.tumblr.com/post/17525116003/node
http.globalAgent.maxSockets = 50;
https.globalAgent.maxSockets = 50;
