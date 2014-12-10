'use strict';

module.exports.login = function login(email, password) {
  return function(nightmare) {
    nightmare
      .wait('#Email')
      .wait('#Passwd')
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
      .wait(2000)
      .click('#submit_approve_access:enabled')
      .wait();
  };
};
