'use strict';
const glob = require('glob');
const chalk = require('chalk');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const projectPath = './src/projects/';
//获取环境变量
const isBuild = process.env.NODE_ENV === 'production';
// 获取参数
const [projectName, pageName] = process.argv.slice(2);
// const pageName = isBuild ? '' : pageTemp;
console.assert(projectName, chalk.red('项目名称不能为空'));

exports.entries = () => {
  const entries = {};
  glob.sync(`${projectPath}${projectName}/${isBuild || !pageName ? '**' : pageName}/index.js`).forEach((entryPath) => {
    const regExp = new RegExp(`/${projectName}/(\\w+)/`);
    const name = entryPath.match(regExp)[1];
    entries[name] = entryPath;
  });
  return entries;
};

exports.htmlPlugins = () => {
  const htmlPlugins = [];
  glob.sync(`${projectPath}${projectName}/${isBuild || !pageName ? '**' : pageName}/index.html`).forEach((templatePath) => {
    const regExp = new RegExp(`/${projectName}/(\\w+)/`);
    const name = templatePath.match(regExp)[1];
    htmlPlugins.push(new HtmlWebpackPlugin({
      template: templatePath,
      filename: `${name}.html`,
      chunks: [name],
      minify: false
    }))
  });
  return htmlPlugins;
};
