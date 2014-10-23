'use strict';

var env = require('../../../config');

module.exports.login = function login(email, password) {
  return function(nightmare) {
    nightmare
      .goto(env.managerUrl + '/sign_in')
      .type('#email', email)
      .type('#password', password)
      .click('button[type="submit"]')
      .wait();
  };
};

module.exports.connect = function login(id) {
  return function(nightmare) {
    nightmare
      .goto(env.managerUrl + '/connect/' + id + '?bearer=' + env.credentials.token)
      .wait();
  };
};