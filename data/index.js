'use strict';
/* @flow */

var fs = require('fs');
var dataDir = fs.realpathSync(`${__dirname}/../data/`);

module.exports = () => {
  return fs.readdirSync(dataDir).filter(file => {
    return file.match(/\.json/i);
  }).reduce((store,file) => {
    store[file.split('.')[0]] = require(`${dataDir}/${file}`);
    return store;
  },{});
};
