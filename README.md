## GraphQL

> GraphQL is a query language created by Facebook in 2012 for describing the capabilities and requirements of data models for client‐server applications.

Basically a set of rules described in the [official specification](http://facebook.github.io/graphql/).
For the JavaScript reference implementation for GraphQL check the [docs api](http://graphql.org/docs/api-reference-graphql/).

The docs are great! They use [Flow](http://flowtype.org/docs/about-flow.html#_) syntax type system. If you are not familiar check some [examples here](https://github.com/besarthoxhaj/learn-facebook-flow).

### Integrated Development Environment (aka IDE, aka playground)

Run the playground with `npm start`.

### Pagination or Connection

Check this: https://facebook.github.io/relay/docs/graphql-connections.html#content.

### Recursion

Is possible of a type to use a filed which type is the same as the parent type. To make it work is important to define `fields` as a function for lazy loading.

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

### [Scalar](http://facebook.github.io/graphql/#sec-Scalars)
In GraphQL the most basic type is a `Scalar`.

### Custom types
> GraphQL provides a number of built‐in scalars, but type systems can add additional scalars with semantic meaning. For example, a GraphQL system could define a scalar called Time which, while serialized as a string, promises to conform to ISO‐8601.

Check:
  - [graphql-js](https://github.com/graphql/graphql-js/issues/44)
  - [learning-graphql](https://github.com/mugli/learning-graphql/blob/master/7.%20Deep%20Dive%20into%20GraphQL%20Type%20System.md)
  - [graphql-type-factory](https://github.com/xpepermint/graphql-type-factory)
  - [medium article](https://medium.com/@tarkus/validation-and-user-errors-in-graphql-mutations-39ca79cd00bf#.7k1au2x26)

### [Introspection](http://facebook.github.io/graphql/#sec-Introspection)
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
});
```

### [express-graphql](https://github.com/graphql/express-graphql)

Interestingly the spec implementation on express is just a call to the [execute](https://github.com/graphql/express-graphql/blob/master/src/index.js#L208) function of graphql.

### Resources
- Nick Schrock - GraphQL Servers [YouTube](https://www.youtube.com/watch?v=KOudxKJXsjc)

### Example

This is an personal evolving example of things possible with graphql.

```js
/**
 * Create a new user
 * @operation: mutation
 */



```
