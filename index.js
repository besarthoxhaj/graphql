'use strict';

var util = require('util');
var graphqlHTTP = require('express-graphql');
var express = require('express');
var schema = require('./schema.js');

var app = express()
app.use(express.static(__dirname + '/ide'));
app.use('/graphql',graphqlHTTP({schema:schema,pretty:true})).listen(3000);
console.log(`
  Graphql ide running on localhost:3000
`);
