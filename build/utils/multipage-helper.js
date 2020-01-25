'use strict';
const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('../config');
const utils = require('./index');
const fs = require("fs");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurifyCssPlugin = require('purifycss-webpack');

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
  glob.sync(`${projectPath}${projectName}/pages/${isBuild || !pageName ? '**' : pageName}/index.js`).forEach((entryPath) => {
    const regExp = new RegExp(`/${projectName}/pages/(\\w+)/`);
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
      filename: isBuild ? path.posix.join(config.assetsRoot, `${key}.html`) : `${key}`,
      chunks: [key],
      minify: false
    }));
  });
  return htmlPlugins;
};

const cssRules = () => {
  const isCustomVar = fs.existsSync(path.join(__dirname, `../../src/projects/${projectName}/var.scss`));
  let prependData = ` @import "@/styles/mixins/prepend.scss"; `;
  if (isCustomVar) {
    prependData += `@import "@/projects/${projectName}/var.scss"; `;
  }
  return {
    test: /\.(css|scss|sass)$/,
    use: [
      isBuild ? {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: '../../',
        }
      } : {loader: 'style-loader'},
      { loader: 'css-loader' },
      {
        loader: 'sass-loader',
        options: {
          prependData,
          implementation: require('sass')
        }
      },
      { loader: 'postcss-loader' }
    ]
  };
};

module.exports = () => {
  const entry = entries();
  const htmlPluginList = htmlPlugins(entry);
  const plugins = [...htmlPluginList];
  const output = {
    path: isBuild ? config.assetsRoot : config.assetsRoot,
    filename: isBuild ? utils.assetsPath('js/[name].js') : '[name].js',
    publicPath: isBuild
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
  };
  if (isBuild) {
    output.chunkFilename = utils.assetsPath('js/[id].js');
    plugins.push(
        new MiniCssExtractPlugin({
          filename: utils.assetsPath('css/[name].css')
        })
    );
    if (config.build.purifyCss) {
      plugins.push(
          new PurifyCssPlugin({
            paths: glob.sync(path.join(__dirname, `../../src/projects/${projectName}/pages/**/index.html`))
          })
      )
    }
  }
  return {entry, plugins, output, rules: [cssRules()]};
};
