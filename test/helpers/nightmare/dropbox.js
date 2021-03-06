'use strict';

module.exports.login = function login(email, password) {
  return function(nightmare) {
    nightmare
      .wait('input[type=email]')
      .wait('input[type=password]')
      .wait('button[type=submit]')
      .type('input[type=email]', email)
      .type('input[type=password]', password)
      .click('button[type=submit]')
      .wait();
  };
};

module.exports.authorize = function authorize() {
  return function(nightmare) {
    nightmare
      .wait('button[name=allow_access]')
      .click('button[name=allow_access]')
      .wait();
  };
};
