'use strict';
/* @flow */

var test = require('tape');
var graphql = require('graphql');
var EmailType = require('../custom.js');
var data = require('../data/index.js')();

test('custom date type', t => {

  var schema = new graphql.GraphQLSchema({
    query:new graphql.GraphQLObjectType({
      name:'Query',
      description:'My query with custom Type',
      fields:() => {
        return {
          user:{
            type:graphql.GraphQLString,
            args:{
              email:{type:EmailType}
            },
            resolve:(source,args,info) => {

              if (args.email) {
                return Object.keys(data.user).reduce((store,elm) => {
                  if (data.user[elm]['email'] === args.email) {
                    store.push(data.user[elm]);
                  }
                  return store;
                },[])[0];
              }

              return Object.keys(data.user).reduce(function (store,elm){
                store.push(data.user[elm]);
                return store;
              },[]);
            }
          }
        };
      }
    })
  });

  var query = `
    {
      user(email: "bes@gmail.com")
    }
  `;

  graphql.graphql(schema,query).then(result => {
    t.equal(result.data.user,'[object Object]','got string which tries to be an object');
    t.end();
  });
});
