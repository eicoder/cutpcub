'use strict';
const glob = require('glob');
const chalk = require('chalk');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('../config');
const utils = require('./index');

const projectPath = './src/projects/';
//获取环境变量
const isBuild = process.env.NODE_ENV === 'production';
// 获取参数
let projectName;
let pageName;
if (isBuild) {
  [projectName, pageName] = process.argv.slice(2);
} else {
  const params = process.argv[process.argv.length - 1];
  const module = params.match(/^--env.project=(.+)/);
  projectName = module[1];
}
// const pageName = isBuild ? '' : pageTemp;
if (!projectName) {
  throw new Error('项目名称不能为空');
}

const entries = () => {
  const entries = {};
  glob.sync(`${projectPath}${projectName}/${isBuild || !pageName ? '**' : pageName}/index.js`).forEach((entryPath) => {
    const regExp = new RegExp(`/${projectName}/(\\w+)/`);
    const name = entryPath.match(regExp)[1];
    entries[name] = entryPath;
  });
  return entries;
};

const htmlPlugins = (entries) => {
  const htmlPlugins = [];
  Object.keys(entries).forEach((key) => {
    htmlPlugins.push(new HtmlWebpackPlugin({
      template: entries[key].replace('.js', '.html'),
      filename: isBuild ? path.posix.join(config.assetsRoot, 'pages', `${key}.html`) : `${key}`,
      chunks: [key],
      minify: false
    }));
  });
  return htmlPlugins;
};

module.exports = () => {
  const entry = entries();
  const htmlPluginList = htmlPlugins(entry);
  const output = {
    path: isBuild ? config.assetsRoot : config.assetsRoot,
    filename: isBuild ? utils.assetsPath('js/[name].js') : '[name].js',
    publicPath: isBuild
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
  };
  if (isBuild) {
    output.chunkFilename = utils.assetsPath('js/[id].js');
  }
  console.log({entry, htmlPluginList, output})
  return {entry, htmlPluginList, output};
};
