'use strict';
/* @flow */

var test = require('tape');
var GraphQL = require('graphql');

test('TTD: complex data with resolves', t => {
  var rawUserType = new GraphQL.GraphQLObjectType({
    name:'User',
    fields:() => ({
      name:{type:GraphQL.GraphQLString},
      age:{type:GraphQL.GraphQLInt},
    })
  });
  var schema = new GraphQL.GraphQLSchema({
    query:new GraphQL.GraphQLObjectType({
      name:'Query',
      fields: () => ({
        user:{type:rawUserType},
        users:{type:new GraphQL.GraphQLList(rawUserType)},
      })
    }),
    mutation:new GraphQL.GraphQLObjectType({
      name:'Mutation',
      fields: () => ({
        addUser:{type:rawUserType}
      })
    })
  });

  t.test('go get my schema', st => {
    st.equal(
      GraphQL.printSchema(schema),
      'type Mutation {\n  addUser: User\n}\n\ntype Query {\n  user: User\n  users: [User]\n}\n\ntype User {\n  name: String\n  age: Int\n}\n',
      'got schema'
    );
    // type Mutation {
    //   addUser: User
    // }
    //
    // type Query {
    //   user: User
    //   users: [User]
    // }
    //
    // type User {
    //   name: String
    //   age: Int
    // }
    st.end();
  });

  t.test('try a bit of queries', st => {

    function promiseSuccess(expectData) {
      return function(res) {
        st.deepEqual(res,expectData.res,expectData.mess);
      }
    }

    var trials = [{
      query:'mutation { users }',
      res:{errors:[{message:'Cannot query field "users" on type "Mutation".'}]},
      mess:'`mutation { users }` needs more care',
    },{
      query:'mutation { user }',
      res:{errors:[{message:'Cannot query field "user" on type "Mutation".'}]},
      mess:'even `mutation { users }` needs more care',
    },{
      query:'mutation { addUser }',
      res:{errors:[{message:'Field "addUser" of type "User" must have a sub selection.'}]},
      mess:'almost',
    },{
      query:'mutation { addUser { name } }',
      res:{data:{addUser:null}},
      mess:'`mutation { addUser { name } }` seems working'
    }];

    st.plan(trials.length);

    trials.forEach(elm => {
      GraphQL.graphql(schema,elm.query).then(promiseSuccess(elm));
    });
  });
});
