'use strict';

var test = require('tape');
var http = require('http');
var util = require('./util.js');

test('2.1:language -> comments should be ignored', function (t) {

  util.request(`
    query {
      user(id: 1) {
        # multi line
        # comment here
        name
      }
    }
  `, function (error,body) {
    t.ok(body['data'],'got datas');
    t.end();
  });
});

test('2.3:operations -> should default to query', function (t) {

  util.request(`
    {
      user(id: 1) {
        name
      }
    }
  `, function (error,body) {
    t.ok(body['data'],'got datas');
    t.end();
  });
});

test('2.3:operations -> wrong operation', function (t) {

  util.request(`
    mutation {
      user(id: 1) {
        name
      }
    }
  `, function (error,body) {
    t.deepEqual(body,{
      "errors": [
        {
          "message": "Can only perform a mutation operation from a POST request."
        }
      ]
    });
    t.end();
  });
});

test('2.4:selection sets', function (t) {

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
  `, function (error,body) {
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

test('2.4:selection sets -> let\'s got a bit crazy', function (t) {

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
  `, function (error,body) {
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

test('2.4:selection sets -> sort of joins', function (t) {

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
  `, function (error,body) {
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

test('2.4:selection sets -> sort of pagination', function (t) {

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
  `, function (error,body) {
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

test('2.6:argument', function (t) {
  t.skip();
  t.end();
});

test('2.6:arguments', function (t) {

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

test('2.7:alias', function (t) {

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

test('2.8:fragments', function (t) {
  util.request(`query withFragments {
    user(id: 1) {
      name,
      ...eventFields
      ...friendFields
    }
  }

  fragment eventFields on User {
    events {
      title
    }
  }

  fragment friendFields on User {
    friends {
      name
    }
  }`, function (error,body) {
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
            {"name":"Izaak"},
            {"name":"Ale"}
          ]
        }
      }
    })
    t.end();
  });
});

test('2.9:input values', function (t) {
  t.skip();
  t.end();
});
