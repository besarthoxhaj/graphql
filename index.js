'use strict';

var util = require('util');
var graphql = require('graphql');
var graphqlHTTP = require('express-graphql');
var express = require('express');
var types = require('./types');

// import our data set from above
var user = require('./user');



// define our schema, with one top level field, named `user`, that
// takes an `id` argument and returns the User with that ID.
var schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',

    description: 'Query data',

    // isTypeOf: {}

    // interfaces: function () {
    //   return [
    //     new graphql.GraphQLInterfaceType({
    //       name: 'Entity',
    //       description: 'Not really sure what\'s this',
    //       resolveType: function () {
    //
    //       },
    //       fields: {
    //         user: { type: graphql.GraphQLString }
    //       }
    //     })
    //   ];
    // },

    // fields as function for lazy loading (what does that mean?)
    fields: function () {
      return {
        user: {
          type: types.userType,
          args: {
            id: { type: graphql.GraphQLString }
          },
          resolve: function (source, args, info) {
            return user[args.id];
          }
        },
        users: {
          type: new graphql.GraphQLList(types.userType),
          args: {
            ids: { type: new graphql.GraphQLList(graphql.GraphQLString) },
          },
          resolve: function (source, args, info) {
            return args.ids.map(function (elm) {
              return user[elm];
            });
          }
        }
      };
    }
  }),
  // mutation: new graphql.GraphQLObjectType({
  //   name: 'Mutations',
  //
  // })
});

express().use('/graphql', graphqlHTTP({schema:schema,pretty:true})).listen(3000);
