## GraphQL

> GraphQL is a query language created by Facebook in 2012 for describing the capabilities and requirements of data models for client‐server applications.

Basically a set of rules described in the [official specification.](http://facebook.github.io/graphql/).

### Pagination or Connection

Check this: https://facebook.github.io/relay/docs/graphql-connections.html#content

### Recursion

Is possible of a type to use a filed which type is the same as the parent type. Here an example:

```js
var userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: function () {
    return {
      id: { type: graphql.GraphQLInt },
      name: { type: graphql.GraphQLString },
      friends: { type: new graphql.GraphQLList(userType) }
    }
  }
});
```

To make it work is important to define `fields` as a function for lazy loading.

### Custom types


[### Scalar](http://facebook.github.io/graphql/#sec-Scalars)
In GraphQL the most basic type is a `Scalar`.

[### Introspection](http://facebook.github.io/graphql/#sec-Introspection)

Checking what an graphql endpoint has to offer.

### Discoveries

GraphiQL standard does not impose any http verb. However the implementation uses a POST request similar to the example below.
```js
fetch('url',{
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    operationName:'myFirstOperation'
    query:`
      query myFirstOperation($userId:Int) {
        user(id: $userId) {
          name
        }
      }
    `,
    variables:{userId:1}
  })
})
```

### Resources
- Nick Schrock - GraphQL Servers [YouTube](https://www.youtube.com/watch?v=KOudxKJXsjc)
