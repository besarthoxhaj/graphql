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

### Resources
- Nick Schrock - GraphQL Servers [YouTube](https://www.youtube.com/watch?v=KOudxKJXsjc)
