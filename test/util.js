'use strict';

var http = require('http');

/**
 *
 */
function request (query,callback) {

  http.request({
    port:3000,
    path:`/graphql?query=${encodeURIComponent(query)}`
  }, function (response) {

    var body = undefined;

    response.on('data', function (chunk) {
      body = chunk;
    });

    response.on('end', function () {
      callback(undefined,JSON.parse(body));
    });
  }).end();
}

module.exports = {
  request: request
};
