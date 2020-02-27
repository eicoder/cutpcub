#!/usr/bin/env node

const program = require('commander');
const home = require('user-home');
const chalk = require('chalk');
const path = require('path');
const inquirer = require('inquirer');

const generate = require('./lib/generate');
const logger = require('./lib/logger');
const utils = require('./lib/utils');

program.usage('<项目名称> [页面名称]').on('--help', () => {
  console.log('  Examples:');
  console.log();
  console.log(chalk.gray('    # 新建项目'));
  console.log('    $ cpcub new Bi');
  console.log();
  console.log(chalk.gray('    # 新建项目并添加页面'));
  console.log('    $ cpcub new Bi home');
  console.log();
})
    .parse(process.argv);

const projectName = program.args[0];
const pageName = program.args[1];

if (!projectName) {
  console.log(chalk.red('缺少参数 <项目名称>'));
  return program.help();
}

let to = path.resolve('.');
const tmp = path.join(home, '.cutpcub-templates');

inquirer.prompt([{
  type: 'confirm',
  message: `确定在当前文件夹(${path.resolve('.')})下创建项目吗?`,
  name: 'ok'
}]).then(answers => {
  if (answers.ok) {
    init();
  } else {
    inquirer.prompt([{
      type: 'input',
      message: '请输入要创建项目的工程地址',
      name: 'addr'
    }]).then(answers => {
      if (answers.addr) {
        to = answers.addr;
        init();
      }
    })
  }
}).catch(logger.fatal);

function init() {
  const tPath = utils.getTemplatePath(tmp);
  generate('project', [projectName, tPath, to, err => {
    if (err) logger.fatal(err);
    logger.success('项目创建完成 "%s".', projectName);
    if (pageName) {
      generate('page', [projectName, pageName, tPath, path.resolve('src/projects', projectName), err => {
        if (err) logger.fatal(err);
        logger.success('页面添加完成 "%s".', `${projectName}/${pageName}`);
      }])
    }
  }])
}
