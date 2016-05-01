'use strict';

var fs = require('fs');
var dataDir = fs.realpathSync(`${__dirname}/../data/`);

module.exports = function () {

  return fs.readdirSync(dataDir)
  .filter(function (file) {
    return file.match(/\.json/i);
  })
  .reduce(function (store, file) {
    store[file.split('.')[0]] = require(`${dataDir}/${file}`);
    return store;
  },{});
};
