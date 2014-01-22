'use strict';

var request = require('supertest');
require('should');

var app = require('../app.js');

describe("Ping all the hydraters on /hydrate.", function () {

  it("should receive a code 405", function (done) {
    request(app).get('/init/connect?code=123')
      .expect(302)
      .expect('Location', /google\.com/)
      .end(done);
  });
});


var hydraters = require('./list.js');
var request = require('request');


console.log(hydraters.dependencies[hydraters.list[0]]);

var options = {
  url: hydraters.list[0],
  file_path : "",
  callback : "",
  long_poll : 1,
  document : {
    document_type: '',
    metadatas: {},
    datas: {},
    identifier: 'http://'
  }
};

console.log("Send of the post");
request.post(options, function(error, response, body){
  console.log("receive from ", options.url);
  console.log("error : ", error);
  console.log("response : ", response);
  console.log("body : ", body);
  if((!error && response.statusCode === 202)) {
    console.log("yes");
  }
});
