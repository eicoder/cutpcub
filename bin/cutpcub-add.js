#!/usr/bin/env node

const program = require('commander');
const home = require('user-home');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

const generate = require('./lib/generate');
const logger = require('./lib/logger');
const utils = require('./lib/utils');

program.usage('<项目名称> <页面名称>').on('--help', () => {
  console.log('  Examples:');
  console.log();
  console.log(chalk.gray('    # 创建页面'));
  console.log('    $ cpcub add home');
  console.log();
})
    .parse(process.argv);

const projectName = program.args[0];
const pageName = program.args[1];
if (!projectName || !pageName) {
  !projectName && console.log(chalk.red('缺少参数 <项目名称>'));
  !pageName && console.log(chalk.red('缺少参数 <页面名称>'));
  return program.help();
}

let to = path.resolve('src/projects', projectName);
const tmp = path.join(home, '.cutpcub-templates');

init();

function init() {
  const tPath = utils.getTemplatePath(tmp);
  generate('page', [projectName, pageName, tPath, to, err => {
    if (err) logger.fatal(err);
    logger.success('页面添加完成 "%s".', `${projectName}/${pageName}`);
  }])
}
