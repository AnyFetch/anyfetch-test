'use strict';

module.exports.login = function login(email, password) {
  return function(nightmare) {
    nightmare
      .wait(".button primary")
      .click(".button primary")
      .wait('#use-password')
      .click('#use-password')
      .wait('#user')
      .wait('#password')
      .wait('#login')
      .type('#user', email)
      .type('#password', password)
      .click('#login')
      .wait();
  };
};

module.exports.authorize = function authorize() {
  return function(nightmare) {
    nightmare
      .wait('input[name=approve]')
      .click('input[name=approve]')
      .wait();
  };
};
