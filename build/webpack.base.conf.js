'use strict';

const path = require('path');
const {entry, htmlPluginList, output} = require('./utils/multipage-helper')();
// const config = require('./config');


module.exports = {
  context: path.resolve(__dirname, '../'),
  entry,
  output,
  plugins: [...htmlPluginList]
};
