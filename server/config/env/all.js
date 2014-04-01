'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');
console.log('root path is '+ rootPath);

module.exports = {
  root: rootPath,
  port: process.env.PORT || 3000,
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
};