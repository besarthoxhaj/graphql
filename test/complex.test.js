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
    })
  });

  t.test('go get my schema', st => {
    st.equal(
      GraphQL.printSchema(schema),
      'type Query {\n  user: User\n  users: [User]\n}\n\ntype User {\n  name: String\n  age: Int\n}\n',
      'got schema'
    );
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
      query:'{ users }',
      res:{errors:[{message:'Field "users" of type "[User]" must have a sub selection.'}]},
      mess:'`{ users }` needs more care',
    },{
      query:'query { users { name } }',
      res:{data:{users:null}},
      mess:'`{ users { name } }` got empty users',
    },{
      query:'query { people: users { name } }',
      res:{data:{people:null}},
      mess:'`query { people: users { name } }` aliases work'
    },{
      query:'query { people: users { ...userFields } } fragment userFields on User { name }',
      res:{data:{people:null}},
      mess:'`query { people: users { ...userFields } } fragment userFields on User { name }` fragments work'
    }];

    st.plan(trials.length);

    trials.forEach(elm => {
      GraphQL.graphql(schema,elm.query).then(promiseSuccess(elm));
    });
  });
});
