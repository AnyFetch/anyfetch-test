'use strict';

module.exports.login = function login(email, password) {
  return function(nightmare) {
    nightmare
      .wait("a.button.primary")
      .click("a.button.primary")
      .wait()
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
      .wait('.primary')
      .click('.primary')
      .wait();
  };
};
