'use strict';
/* @flow */

var fetch = require('isomorphic-fetch');

module.exports = {
  request:request
};

function request(query,body,callback) {

  if (typeof body === 'function') {
    callback = body;
  }

  fetch(`http://localhost:3000/graphql`,{
    method:'POST',
    headers:{
      'Accept':'application/json',
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      operationName:undefined,
      query:query,
      variables:body
    })
  }).then(response => {
    return response.json();
  }).then(json => {
    callback(undefined,json);
  }).catch(error => {
    console.log('error',error);
    callback(error,undefined);
  });
}
