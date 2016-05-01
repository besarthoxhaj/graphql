'use strict';

var graphql = require('graphql');
var graphqlError = require('graphql/error');
var graphqlLanguage = require('graphql/language');

/**
 *
 */
function coerceDate (value) {

  if (!(value instanceof Date)) {
    // is this how you raise a 'field error'?
    throw new Error('Field error: value is not an instance of Date');
  }

  if (isNaN(value.getTime())) {
    throw new Error('Field error: value is an invalid Date');
  }

  return value.toJSON();
}


module.exports = new graphql.GraphQLScalarType({
  name: 'DateTime',
  serialize: coerceDate,
  parseValue: coerceDate,
  parseLiteral: function (ast) {

    if (ast.kind !== graphqlLanguage.Kind.STRING) {
      throw new graphqlError.GraphQLError('Query error: Can only parse strings to dates but got a: ' + ast.kind, [ast]);
    }

    var result = new Date(ast.value);

    if (isNaN(result.getTime())) {
      throw new graphqlError.GraphQLError('Query error: Invalid date', [ast]);
    }

    if (ast.value !== result.toJSON()) {
      throw new graphqlError.GraphQLError('Query error: Invalid date format, only accepts: YYYY-MM-DDTHH:MM:SS.SSSZ', [ast]);
    }

    return result;
  }
});
