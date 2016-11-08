'use strict';

var test = require('tape');
var util = require('./_util.js');

test('2.1:language -> comments should be ignored', t => {

  util.request(`
    query {
      user(id: 1) {
        # multi line
        # comment here
        name
      }
    }
  `, (error,body) => {
    t.ok(body['data'],'got datas');
    t.end();
  });
});

test('2.3:operations -> should default to query', t => {

  util.request(`
    {
      user(id: 1) {
        name
      }
    }
  `, (error,body) => {
    t.ok(body['data'],'got datas');
    t.end();
  });
});

// test('2.3:operations -> wrong operation', function (t) {
//
//   util.request(`
//     mutation {
//       user(id: 1) {
//         name
//       }
//     }
//   `, function (error,body) {
//     t.deepEqual(body,{
//       "errors": [
//         {
//           "message": "Can only perform a mutation operation from a POST request."
//         }
//       ]
//     });
//     t.end();
//   });
// });

test('2.4:selection sets', t => {

  util.request(`
    {
      user(id: 1) {
        id,
        name,
        surname,
        age,
        birthday {
          day
        }
      }
    }
  `, (error,body) => {
    t.deepEqual(body,{
      data: {
        user: {
          id: 1,
          name: 'Bes',
          surname: 'Hox',
          age: 25,
          birthday: {
            day: 21
          }
        }
      }
    });
    t.end();
  });
});

test('2.4:selection sets -> let\'s got a bit crazy', t => {

  util.request(`
    {
      user(id: 1) {
        id,
        name,
        friends {
          name,
          friends {
            name
          }
        }
      }
    }
  `, (error,body) => {
    t.deepEqual(body,{
      "data":{
        "user":{
          "id":1,
          "name":"Bes",
          "friends":[
            {
              "name":"Izaak",
              "friends":[
                {"name":"Bes"},
                {"name":"Ale"}
              ]
            },
            {
              "name":"Ale",
              "friends":[
                {"name":"Bes"},
                {"name":"Izaak"}
              ]
            }
          ]
        }
      }
    });
    t.end();
  });
});

test('2.4:selection sets -> sort of joins', t => {

  util.request(`
    {
      user(id: 1) {
        id,
        name,
        events {
          title
        }
      }
    }
  `, (error,body) => {
    t.deepEqual(body,{
      "data":{
        "user":{
          "id":1,
          "name":"Bes",
          "events":[
            {"title":"Hello World"},
            {"title":"Say my name"},
            {"title":"Draw a cat"},
            {"title":"Run a car"}
          ]
        }
      }
    });
    t.end();
  });
});

test('2.4:selection sets -> sort of pagination', t => {

  util.request(`
    {
      user(id: 1) {
        id,
        name,
        friends(first: 1) {
          name
        }
      }
    }
  `, (error,body) => {
    t.deepEqual(body,{
      "data":{
        "user":{
          "id":1,
          "name":"Bes",
          "friends":[
            {"name":"Izaak"}
          ]
        }
      }
    });
    t.end();
  });
});

test('2.6:argument', t => {
  t.skip();
  t.end();
});

test('2.6:arguments', t => {

  util.request(`
    {
      users(ids: [1,2]) {
        id,
        name,
        surname,
        age
      }
    }
  `, function (error,body) {
    t.deepEqual(body,{
      data: {
        users: [
          { id: 1, name: 'Bes', surname: 'Hox', age: 25 },
          { id: 2, name: 'Izaak', surname: 'Rog', age: 26 }
        ]
      }
    });
    t.end();
  });
});

test('2.7:alias', t => {

  util.request(`
    {
      bes: user(id: 1) {
        name
      }
    }
  `, function (error,body) {
    t.deepEqual(body,{
      data: {
        bes: {
          name: 'Bes'}
        }
      }
    );
    t.end();
  });
});

test('2.8:inline fragments', t => {
  util.request(`query inlineFragmentTyping {
    user(id: 1) {
      name,
      ... on User {
        events {
          title
        }
      }
      ... on User {
        friends(orderby: FIRST_NAME) {
          name
        }
      }
    }
  }`, (error,body) => {
    t.deepEqual(body,{
      "data":{
        "user":{
          "name":"Bes",
          "events":[
            {"title":"Hello World"},
            {"title":"Say my name"},
            {"title":"Draw a cat"},
            {"title":"Run a car"}
          ],
          "friends":[
            {"name":"Ale"},
            {"name":"Izaak"}
          ]
        }
      }
    })
    t.end();
  });
});

test('2.10:variable and directives', t => {
  util.request(`
    query ($userId:Int, $withEvents:Boolean!, $withFriends:Boolean!) {
      user(id: $userId) {
        name,
        events @include(if: $withEvents) {
        	...eventFragment
        },
        ...friendFields @skip(if: $withFriends)
      }
    }

    fragment eventFragment on Event {
      id
    }

    fragment friendFields on User {
      friends(orderby: FIRST_NAME) {
        name
      }
    }
  `,
  {userId: 3, withEvents: false, withFriends: false},
  (error,body) => {
    t.deepEqual(body,{
      "data":{
        "user":{
          "name":"Ale",
          "friends":[
            {"name":"Bes"},
            {"name":"Izaak"}
          ]
        }
      }
    });
    t.end();
  });
});
