'use strict';
/* @flow */

var graphql = require('graphql');
var types = require('./types');
var data = require('./data/index.js')();

module.exports = new graphql.GraphQLSchema({
  query:new graphql.GraphQLObjectType({
    name:'Query',
    description:'Query data',
    fields:() => {
      return {
        user:{
          type:types.userType,
          args:{
            id:{type:graphql.GraphQLInt}
          },
          resolve:(source,args,info) => {
            return data.user[args.id];
          }
        },
        users:{
          type:new graphql.GraphQLList(types.userType),
          args:{
            ids:{type:new graphql.GraphQLList(graphql.GraphQLInt)},
          },
          resolve:(source,args,info) => {
            // console.log('resolve:users:source',source);
            // console.log('resolve:users:args',args);
            // console.log('resolve:users:info',info);
            return args.ids.map(elm => {
              return data.user[elm];
            });
          }
        }
      };
    }
  }),
  mutation: new graphql.GraphQLObjectType({
    name:'Mutation',
    description:'Mutate data',
    fields:() => {
      return {
        addUser:{
          type:types.userType,
          args:{
            name:{type:graphql.GraphQLString},
            surname:{type:graphql.GraphQLString},
            // birthday:{type:types.birthdayType}
          },
          resolve:(source,args,info) => {
            console.log('arguments',arguments);
            return 'hello';
          }
        }
      };
    }
  })
});
