'use strict';

var env = require('../../../config');

module.exports.login = function login(email, password) {
  return function(nightmare) {
   nightmare
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
      .wait()
      .screenshot('./after-authorize.png');
  };
};