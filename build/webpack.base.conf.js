'use strict';

const path = require('path');
const {entry, plugins, output, rules} = require('./utils/multipage-helper')();
const utils = require('./utils');
// const config = require('./config');

function resolve (dir) {
  return path.join(__dirname, '..', dir);
}

let i = 1;

function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  } else {
    return false;
  }
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
  optimization: {
    minimize: false,
    splitChunks: {
      cacheGroups: {
        // icon: {
        //   name: 'icon',
        //   test: (m, c, entry) => {
        //     m.constructor.name === 'CssModule' && console.log(m.context, m.context.includes('icon'));
        //     return m.constructor.name === 'CssModule' && m.context.includes('icon')
        //   },
        //   chunks: 'all',
        //   enforce: true,
        // },
        commons: {
          name: 'commons' ,  // 提取出来的文件命名
          chunks: 'all',   // initial表示提取入口文件的公共css及
          // chunks: 'all' // 提取所有文件的公共部分
          // test： '/\.css$/'  // 只提取公共css ，命名可改styles
          minChunks:2, // 表示提取公共部分最少的文件数
          minSize: 0  // 表示提取公共部分最小的大小
          // 如果发现页面中未引用公共文件，加上enforce: true
        }
      }
    }
  },
  plugins: [...plugins]
};
