const path = require('path');

module.exports = {
  assetsRoot: path.resolve(__dirname, '../dist'),
  dev: {
    port: 8080,
    notifyOnErrors: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    env: {
      NODE_ENV: '"development"'
    }
  },
  build: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    env: {
      NODE_ENV: '"production"'
    }
  }
};
