'use strict';

const path = require('path');
const {entry, plugins, output, rules} = require('./utils/multipage-helper')();
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
        ...rules,
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons' ,  // 提取出来的文件命名
          // name： ‘common/common’ //  即先生成common文件夹
          chunks: 'initial',   // initial表示提取入口文件的公共css及
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
