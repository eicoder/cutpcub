#!/usr/bin/env node

const program = require('commander');
const logger = require('./lib/logger');

program
    .usage('fetch')
    .option('-c, --clone', 'use git clone')
    .option('-g, --git <git>', '自定义模版位置')
    .parse(process.argv);

const ora = require('ora');
const rm = require('rimraf').sync;
const download = require('download-git-repo');
const path = require('path');
const exists = require('fs').existsSync;
const home = require('user-home');

const tmp = path.join(home, '.cutpcub-templates');
const clone = program.clone || false;
const template = program.git || 'eicoder/cutpcub-template';

init();


function init() {
  const spinner = ora('下载模板');
  spinner.start();
  // Remove if local template exists
  if (exists(tmp)) rm(tmp);
  download(template, tmp, { clone }, err => {
    spinner.stop();
    if (err) logger.fatal('Failed to download repo ' + template + ': ' + err.message.trim())
    else logger.success('模版更新完成');
  })
}
