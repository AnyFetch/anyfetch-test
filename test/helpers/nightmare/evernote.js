'use strict';

module.exports.login = function login(email, password) {
  return function(nightmare) {
    nightmare
      .wait('#username')
      .wait('#password')
      .wait('#login')
      .type('#username', email)
      .type('#password', password)
      .click('#login')
      .wait();
  };
};

module.exports.authorize = function authorize() {
  return function(nightmare) {
    nightmare
      .wait('input[type=submit].Btn_emph')
      .click('input[type=submit].Btn_emph')
      .wait();
  };
};
