'use strict';

var graphql = require('graphql');

var birthdayType = new graphql.GraphQLObjectType({
  name: 'Birthday',
  fields: {
    day: { type: graphql.GraphQLInt },
    month: { type: graphql.GraphQLInt },
    year: { type: graphql.GraphQLInt }
  }
});

var userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
    surname: { type: graphql.GraphQLString },
    age: { type: graphql.GraphQLInt },
    birthday: { type: birthdayType }
  }
});

var eventType = new graphql.GraphQLObjectType({
  name: 'Event',
  fields: {
    id: { type: graphql.GraphQLInt },
    title: { type: graphql.GraphQLString },
    users: new graphql.GraphQLList(userType)
  }
});

var likeType = new graphql.GraphQLObjectType({
  name: 'Like',
  fields: {
    id: { type: graphql.GraphQLInt },
    user: { type: userType }
  }
});

var commentType = new graphql.GraphQLObjectType({
  name: 'Comment',
  fields: {
    id: { type: graphql.GraphQLInt },
    text: { type: graphql.GraphQLString },
    user: { type: userType },
    likes: { type: likeType }
  }
});

var postType = new graphql.GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: graphql.GraphQLInt },
    title: { type: graphql.GraphQLString },
    comments: { type: new graphql.GraphQLList(commentType) },
    user: { type: userType }
  }
});

module.exports = {
  userType: userType,
  eventType: eventType,
  likeType: likeType,
  commentType: commentType,
  postType: postType
};
