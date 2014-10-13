'use strict';

var env = require('../../../config');

module.exports.login = function login(email, password) {
  return function(nightmare) {
   nightmare
    .wait('#signIn')
    .type('#Email', email)
    .type('#Passwd', password)
    .click('#signIn')
    .wait();
  };
};

module.exports.authorize = function authorize() {
  return function(nightmare) {
    nightmare
      .wait('#submit_approve_access:enabled')
      //.wait(3000)
      .click('#submit_approve_access')
      .wait();
  };
};