'use strict';

const path = require('path');
const {entry, plugins, output, rules} = require('./utils/multipage-helper')();
const utils = require('./utils');
// const config = require('./config');

function resolve (dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry,
  output,
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src')
    }
  },
  module: {
    rules: [
        {
          test: /\.js$/,
          use: [{
            loader: "babel-loader"
          }],
          include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'file-loader',
          exclude: [resolve('src/projects/**/*.png')],
          options: {
            name: utils.assetsPath('img/[name].[ext]')
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'file-loader',
          options: {
            name: utils.assetsPath('media/[name].[ext]')
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[ext]')
          }
        },
        ...rules
    ]
  },
  plugins: [...plugins]
};
