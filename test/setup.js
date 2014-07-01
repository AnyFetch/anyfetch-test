'use strict';

var request = require('supertest');
var async = require('async');

var config = require('./config.js');

before(function createUserCredential(done) {
  var timestamp = (new Date()).getTime();

  async.waterfall([
    function(cb) {
      request(config.apiUrl)
      .post('/users')
      .set('Authorization', 'Basic ' + config.masterCredential)
      .send({
        "email": "test-" + timestamp + "@anyfetch.com",
        "name": "test-" + timestamp,
        "password": "test_password",
        "is_admin": false
      })
      .end(function(err, res) {
        config.user = res.body;
        config.user.password = "test_password";
        cb();
      });
    },
    function(cb) {
      request(config.apiUrl)
      .post('/subcompanies')
      .set('Authorization', 'Basic ' + config.masterCredential)
      .send({
        "user": config.user.id,
        "name": "test-company-" + timestamp,
      })
      .end(function(err, res) {
        config.subcompany = res.body;
        cb();
      });
    }
  ],
  function() {
    config.basicCredential = (new Buffer(config.user.email + ":" + config.user.password)).toString('base64');
    done();
  });
});


after(function deleteUserCredential(done) {
  request(config.apiUrl)
  .del('/subcompanies/' + config.subcompany.id)
  .set('Authorization', 'Basic ' + config.masterCredential)
  .end(function(err, res) {
    done();
  });
});