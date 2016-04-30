'use strict';

var http = require('http');

/**
 *  Parse
 */
function parse (string) {
    return string
      .replace(/#.*\n/g,'') // Comments - 2.1.5
      .replace(/\s/g,'');
}

/**
 *
 */
function request (query,callback) {

  http.request({
    port:3000,
    path:`/graphql?query=${parse(query)}`
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
  parse: parse,
  request: request
};
