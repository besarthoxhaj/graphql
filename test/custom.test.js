'use strict';

var test = require('tape');
var graphql = require('graphql');
var EmailType = require('../custom.js');

test('custom date type', function (t) {

  var schema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
      name: 'Query',
      description: 'My query with custom Type',
      fields: function () {
        return {
          user: {
            type: graphql.GraphQLString,
            args: {
              email: { type: EmailType }
            },
            resolve: function (source, args, info) {
              console.log('arguments',arguments);
              return undefined;
            }
          }
        };
      }
    })
  });

  var query = `
    {
      user(email: "bes@mail.com")
    }
  `;

  graphql.graphql(schema,query).then(function (result) {
    // console.log('result',result);
    t.end();
  });
});
