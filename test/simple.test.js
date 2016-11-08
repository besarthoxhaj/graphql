'use strict';
/* @flow */

var test = require('tape');
var GraphQL = require('graphql');

test('TTD: bare minimum to run a query schema', t => {

  var schema = new GraphQL.GraphQLSchema({
    query: new GraphQL.GraphQLObjectType({
      name:'User',
      fields:() => ({name:{type:GraphQL.GraphQLString}})
    })
  });

  t.test('go get my schema', st => {
    st.equal(
      GraphQL.printSchema(schema),
      'type User {\n  name: String\n}\n',
      'got schema'
    );
    st.end();
  });

  t.test('wrong query', st => {

    st.plan(15);

    function promiseSuccess(errorMess) {
      return function({errors}) {
        st.equal(errors.length,1,'got one error');
        st.ok(errors[0] instanceof GraphQL.GraphQLError,'got a GraphQLError');
        // node the column = 2 refers to `h` in `{hello}`
        st.deepEqual(GraphQL.formatError(errors[0]).message,errorMess,'got error parsed');
      }
    }

      function promiseError(error) {
        // never get called :-( cause the implementation
        // does never reject https://github.com/graphql/graphql-js/blob/master/src/graphql.js#L70
        st.fail();
      }

      [{
        query:'query {hello}',
        errorMess:'Cannot query field "hello" on type "User".'
      },{
        query:'{hello}',
        errorMess:'Cannot query field "hello" on type "User".'
      },{
        query:'mutation {hello}',
        errorMess:'Schema is not configured for mutations'
      },{
        query:'query { Event { name } }',
        errorMess:'Cannot query field "Event" on type "User".'
      },{
        query:'Event { hello }',
        errorMess:'Syntax Error GraphQL request (1:1) Unexpected Name "Event"\n\n1: Event { hello }\n   ^\n'
      }].forEach(elm => {
        GraphQL.graphql(schema,elm.query).then(promiseSuccess(elm.errorMess),promiseError);
      });
  });

  t.test('right query', st => {

    st.plan(3);

    function promiseSuccess(expectData) {
      return function(res) {
        st.deepEqual(res,expectData.res,expectData.mess);
      }
    }

    [{
      query:'query {name}',
      res:{data:{name:null}},
      mess:'got right mess'
    },{
      query:'query User {name}',
      res:{data:{name:null}},
      mess:'got right mess'
    },{
      query:'query Event {name}',
      res:{data:{name:null}},
      mess:'got right mess'
    }].forEach(elm => {
      GraphQL.graphql(schema,elm.query).then(promiseSuccess(elm));
    });
  });
});

test('TTD: more complex types', t => {

  var schema = new GraphQL.GraphQLSchema({
    query:new GraphQL.GraphQLObjectType({
      name:'Query',
      fields:{
        user:{
          name:'User',
          type:new GraphQL.GraphQLObjectType({
            name:'User',
            fields:() => ({
              name:{type:GraphQL.GraphQLString},
              age:{type:GraphQL.GraphQLInt},
            })
          })
        },
        car:{
          name:'Car',
          type:new GraphQL.GraphQLObjectType({
            name:'Car',
            fields:() => ({
              model:{type:GraphQL.GraphQLString},
              year:{type:GraphQL.GraphQLInt},
            })
          })
        }
      }
    })
  });

  t.test('go get my schema', st => {
    st.equal(
      GraphQL.printSchema(schema),
      'type Car {\n  model: String\n  year: Int\n}\n\ntype Query {\n  user: User\n  car: Car\n}\n\ntype User {\n  name: String\n  age: Int\n}\n',
      'got schema'
    );
    // type Car {
    //   model: String
    //   year: Int
    // }
    //
    // type Query {
    //   user: User
    //   car: Car
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
      query:'{ name }',
      res:{errors:[{message:'Cannot query field "name" on type "Query".'}]},
      mess:'seems just `{ name }` does not work, it\'s looking on Query'
    },{
      query:'query { name }',
      res:{errors:[{message:'Cannot query field "name" on type "Query".'}]},
      mess:'even `query { name }` does not work, it\'s still looking on Query'
    },{
      query:'query { user }',
      res:{errors:[{message:'Field "user" of type "User" must have a sub selection.'}]},
      mess:'`query { user }` needs a subselection'
    },{
      query:'query { user { name } }',
      res:{data:{user:null}},
      mess:'got empty user'
    },{
      query:'query { user { name, age } }',
      res:{data:{user:null}},
      mess:'`query { user { name, age } }` got empty user'
    },{
      query:'query { user { name, age }, car { model } }',
      res:{data:{car:null,user:null}},
      mess:'`query { user { name, age }, car { model } }` got empty user and car'
    },{
      query:'query { user { hello } }',
      res:{errors:[{message:'Cannot query field "hello" on type "User".'}]},
      mess:'`query { user { hello } }` got error'
    },{
      query:'query { __schema }',
      res:{errors:[{message:'Field "__schema" of type "__Schema!" must have a sub selection.'}]},
      mess:'`query { __schema }` almost'
    },{
      query:'query { __schema { types { name } } }',
      res:{
        data:{
          __schema:{
            types:[
              {name:'Query'},
              {name:'User'}, // <-- our custom type
              {name:'String'},
              {name:'Int'},
              {name:'Car'}, // <-- our custom type
              {name:'__Schema'},
              {name:'__Type'},
              {name:'__TypeKind'},
              {name:'Boolean'},
              {name:'__Field'},
              {name:'__InputValue'},
              {name:'__EnumValue'},
              {name:'__Directive'}
            ]
          }
        }
      },
      mess:'`query { __schema { types { name } } }` worked'
    },{
      query:'query { __schema { queryType { name } } }',
      res:{data:{__schema:{queryType:{name:'Query'}}}},
      mess:'`query { __schema { queryType { name } } }` got simple res'
    },{
      query:'query { __schema { queryType { name } } }',
      res:{data:{__schema:{queryType:{name:'Query'}}}},
    }];

    st.plan(trials.length);

    trials.forEach(elm => {
      GraphQL.graphql(schema,elm.query).then(promiseSuccess(elm));
    });
  });
});
