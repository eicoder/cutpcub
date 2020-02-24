#!/usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const ora = require('ora');
const rm = require('rimraf').sync;
const download = require('download-git-repo');
const path = require('path');
const exists = require('fs').existsSync;
const home = require('user-home');

const logger = require('./lib/logger');
const generate = require('./lib/generate');

program
    .usage('[工程名称]')
    .option('-c, --clone', 'use git clone')
    .option('-g, --git <git>', '自定义模版位置')
    .option('--offline', '使用缓存，不重新加载')
    .parse(process.argv);

const rawName = program.args[0];
const to = path.resolve(rawName || '.');
const inPlace = !rawName || rawName === '.';
const name = inPlace ? path.relative('../', process.cwd()) : rawName;
// 下载模版
const tmp = path.join(home, '.cutpcub-templates');

const customGit = program.git;
const offline = program.offline;
const clone = program.clone || false;


if (inPlace || exists(to)) {
  inquirer.prompt([{
    type: 'confirm',
    message: inPlace
        ? '是否在当前目录中生成项目?'
        : '目标目录的存在。是否继续?',
    name: 'ok'
  }]).then(answers => {
    if (answers.ok) {
      init();
    }
  }).catch(logger.fatal);
} else {
  init();
}

/**
 * 入口函数
 */
function init() {
  if (offline) {
    const templatePath = getTemplatePath(tmp);
    if (exists(templatePath)) {
      generate('init', [name, templatePath, to, err => {
        if (err) logger.fatal(err)
        logger.success('工程创建完成 "%s".', name)
      }])
    } else {
      logger.fatal('Local template "%s" not found.', template)
    }
  } else if (customGit) {
    downloadAndGenerate(customGit);
  } else {
    const officialTemplate = 'eicoder/cutpcub-template';
    downloadAndGenerate(officialTemplate);
  }
}

function getTemplatePath (templatePath) {
  return path.isAbsolute(templatePath)
      ? templatePath
      : path.normalize(path.join(process.cwd(), templatePath));
}

/**
 * Download a generate from a template repo.
 *
 * @param {String} template
 */

function downloadAndGenerate (template) {
  const spinner = ora('下载模板');
  spinner.start();
  // Remove if local template exists
  if (exists(tmp)) rm(tmp);
  download(template, tmp, { clone }, err => {
    spinner.stop();
    if (err) logger.fatal('Failed to download repo ' + template + ': ' + err.message.trim())
    generate('init', [name, tmp, to, err => {
      if (err) logger.fatal(err);
      logger.success('工程创建完成 "%s".', name);
    }]);
  })
}
