const path = require('path');

module.exports = {
  assetsRoot: path.resolve(__dirname, '../dist'),
  dev: {
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    notifyOnErrors: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    autoOpenBrowser: true,
    errorOverlay: true,
    proxyTable: {},
    env: {
      NODE_ENV: '"development"'
    }
  },
  build: {
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    purifyCss: true, // 是否开启去除无用的css （动态引入的css会被消除）
    env: {
      NODE_ENV: '"production"'
    }
  }
};
