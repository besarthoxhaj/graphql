'use strict';

var http = require('http');
require('isomorphic-fetch');

/**
 *
 */
function request (query, body, callback) {

  if (typeof body === 'function') {
    callback = body;
  }

  fetch(`http://localhost:3000/graphql`,{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      operationName: undefined,
      query: query,
      variables: body
    })
  })
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    callback(undefined,json);
  })
  .catch(function (error) {
    console.log('error',error);
    callback(error,undefined);
  });
}

module.exports = {
  request: request
};
