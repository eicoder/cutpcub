#!/usr/bin/env node

const program = require('commander');
const home = require('user-home');
const path = require('path');
const inquirer = require('inquirer');

const generate = require('./lib/generate');
const logger = require('./lib/logger');
const utils = require('./lib/utils');

program.usage('<项目名> <页面名称>')
    .parse(process.argv);

const projectName = program.args[0];
const pageName = program.args[1];

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
