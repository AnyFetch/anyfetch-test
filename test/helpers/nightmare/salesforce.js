'use strict';

module.exports.login = function login(email, password) {
  return function(nightmare) {
    nightmare
      .wait('input#username')
      .wait('input#password')
      .wait('button#Login')
      .type('input#username', email)
      .type('input#password', password)
      .click('button#Login')
      .wait();
  };
};

module.exports.authorize = function authorize() {
  return function(nightmare) {
    nightmare
      .wait('#oaapprove')
      .click('#oaapprove')
      .wait();
  };
};
