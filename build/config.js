const path = require('path');

module.exports = {
  dev: {
    port: 8080,
    notifyOnErrors: true
  },
  build: {
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/'
  }
};
