'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const config = require('./config');

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  plugins: [
      new webpack.DefinePlugin({
        'process.env': config.build.env
      })
  ],
  optimization: {
    minimize: false,
    splitChunks: {
      cacheGroups: {
        // icon: {
        //   name: 'icon',
        //   chunks: 'all',
        //   minChunks: 1,
        //   minSize: 0,
        //   test(module) {
        //     console.log(module.constructor.name === 'CssModule');
        //     return module.constructor.name === 'CssModule'
        //   }
        // },
        commons: {
          name: 'icon',
          chunks: 'all',
          minChunks: 1,
          minSize: 0,
          test: /\biconfont\.css$/
        }
        // commons: {
        //   name: 'commons',
        //   chunks: 'all',
        //   minChunks: 2,
        //   minSize: 0,
        //   test(module) {
        //     module.constructor.name === 'CssModule' && console.log(module);
        //     return module.constructor.name === 'CssModule'
        //   }
        // }
        // icon: {
        //   name: 'icon',
        //   test: (m, c, entry) => {
        //     m.constructor.name === 'CssModule' && console.log(m.context, m.context.includes('icon'));
        //     return m.constructor.name === 'CssModule' && m.context.includes('icon')
        //   },
        //   chunks: 'all',
        //   enforce: true,
        // },
        // commons: {
        //   name: 'commons' ,  // 提取出来的文件命名
        //   chunks: 'all',   // initial表示提取入口文件的公共css及
        //   // chunks: 'all' // 提取所有文件的公共部分
        //   // test： '/\.css$/'  // 只提取公共css ，命名可改styles
        //   minChunks:2, // 表示提取公共部分最少的文件数
        //   minSize: 0  // 表示提取公共部分最小的大小
        //   // 如果发现页面中未引用公共文件，加上enforce: true
        // }
      }
    }
  }
});

module.exports = webpackConfig;
