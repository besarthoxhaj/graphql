'use strict';
/* @flow */

var graphql = require('graphql');
var data = require('./data/index.js')();

var birthdayType = new graphql.GraphQLObjectType({
  name:'Birthday',
  fields:() => {
    return {
      day:{type:graphql.GraphQLInt},
      month:{type:graphql.GraphQLInt},
      year:{type:graphql.GraphQLInt}
    }
  }
});

var userType = new graphql.GraphQLObjectType({
  name:'User',
  fields:() => {
    return {
      id:{type:graphql.GraphQLInt},
      name:{type:graphql.GraphQLString},
      surname:{type:graphql.GraphQLString},
      age:{type:graphql.GraphQLInt},
      birthday:{type:birthdayType},
      posts:{type:new graphql.GraphQLList(postType)},
      friends:{
        name:'Friends',
        type:new graphql.GraphQLList(userType),
        args:{
          first:{type:graphql.GraphQLInt},
          orderby:{
            type:new graphql.GraphQLEnumType({
              name:'orderby',
              values:{
                FIRST_NAME:{value:'name'},
                LAST_NAME:{value:'surname'}
              }
            })
          }
        },
        resolve:(source,args,info) => {
          return source.friends.map(elm => {
            return data.user[elm];
          }).slice(0,args.first).sort((a,b) => {
            if (a[args.orderby] < b[args.orderby]) return -1;
            if (a[args.orderby] > b[args.orderby]) return 1;
            return 0;
          });
        }
      },
      comments:{
        type:new graphql.GraphQLList(commentType),
        resolve:(source,args,info) => {
          // do stuff
        }
      },
      events:{
        name:'Events',
        type:new graphql.GraphQLList(eventType),
        resolve:(source,args,info) => {
          return Object.keys(data.event).reduce((store,key) => {
            if (data.event[key]['users'].indexOf(source.id) > -1) {
              store.push(data.event[key]);
            }
            return store;
          },[]);
        }
      },
      todos:{
        name:'Todos',
        type:new graphql.GraphQLList(todoType)
      }
    }
  }
});

var eventType = new graphql.GraphQLObjectType({
  name:'Event',
  fields:() => {
    return {
      id:{type:graphql.GraphQLInt},
      title:{type:graphql.GraphQLString},
      users:{type:new graphql.GraphQLList(userType)}
    }
  }
});

var likeType = new graphql.GraphQLObjectType({
  name:'Like',
  fields:() => {
    return {
      id:{type:graphql.GraphQLInt},
      user:{type:userType}
    }
  }
});

var commentType = new graphql.GraphQLObjectType({
  name:'Comment',
  fields:() => {
    return {
      id:{type:graphql.GraphQLInt},
      text:{type:graphql.GraphQLString},
      user:{type:userType},
      likes:{type:likeType}
    }
  }
});

var postType = new graphql.GraphQLObjectType({
  name:'Post',
  fields:() => {
    return {
      id:{type:graphql.GraphQLInt},
      title:{type:graphql.GraphQLString},
      comments:{type:new graphql.GraphQLList(commentType)},
      user:{type:userType},
    }
  }
});

var todoType = new graphql.GraphQLObjectType({
  name:'Todo',
  fields:() => {
    return {
      id:{type:graphql.GraphQLInt},
      title:{type:graphql.GraphQLString},
      comments:{type:new graphql.GraphQLList(commentType)},
      // deadline:{type:  }
      user:{type:userType}
    }
  }
});

module.exports = {
  userType:userType,
  eventType:eventType,
  likeType:likeType,
  commentType:commentType,
  postType:postType,
  birthdayType:birthdayType,
};
