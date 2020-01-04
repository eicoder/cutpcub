'use strict';

const path = require('path');
const multiPageHelper = require('./utils/multipage-helper');
const config = require('./config');


module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: multiPageHelper.entries(),
  output: {
    path: config.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
  },
  plugins: [...multiPageHelper.htmlPlugins()]
};
