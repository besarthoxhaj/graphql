'use strict';

var util = require('util');
var graphql = require('graphql');
var graphqlHTTP = require('express-graphql');
var express = require('express');
var schema = require('./schema.js');

express().use('/graphql', graphqlHTTP({schema:schema,pretty:true})).listen(3000);
