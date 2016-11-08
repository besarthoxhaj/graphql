'use strict';

var util = require('util');
var graphql = require('graphql');
var graphqlError = require('graphql/error');
var graphqlLanguage = require('graphql/language');
var Joi = require('joi');

module.exports = new graphql.GraphQLScalarType({
  name:'Email',
  description:'My first custom type',
  serialize:(value) => {
    console.log('serialize:value',value);
    return value
  },
  parseValue:(value) => {
    console.log('parseValue:value',value);
    return value
  },
  parseLiteral:(ast) => {

  /*
   *
    {
      kind: 'StringValue',
      value: 'bes@mail.com',
      loc: {
        start: 25,
        end: 39,
        source:{
          body: '{user(email: "bes@mail.com")}',
          name: 'GraphQL request'
        }
      }
    }
   */

    return ast.value;
  }
});
