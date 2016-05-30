'use strict';

var graphql = require('graphql');
var types = require('./types');
var data = require('./data/index.js')();

module.exports = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    description: 'Query data',
    fields: function () {
      return {
        user: {
          type: types.userType,
          args: {
            id: { type: graphql.GraphQLInt }
          },
          resolve: function (source, args, info) {
            return data.user[args.id];
          }
        },
        users: {
          type: new graphql.GraphQLList(types.userType),
          args: {
            ids: { type: new graphql.GraphQLList(graphql.GraphQLInt) },
          },
          resolve: function (source, args, info) {
            return args.ids.map(function (elm) {
              return data.user[elm];
            });
          }
        }
      };
    }
  }),
  mutation: new graphql.GraphQLObjectType({
    name: 'Mutation',
    description: 'Mutate data',
    fields: function () {
      return {
        addUser: {
          type: types.userType,
          args: {
            name: { type: graphql.GraphQLString },
            surname: { type: graphql.GraphQLString },
            // birthday: { type: types.birthdayType }
          },
          resolve: function (source, args, info) {
            console.log('arguments',arguments);
            return 'hello';
          }
        }
      };
    }
  })
});
