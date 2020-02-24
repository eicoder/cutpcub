#!/usr/bin/env node

const program = require('commander');

program
    .version(require('../package').version, '-v --version')
    .command('init [工程名]', '初始化工程')
    .command('fetch', '更新模版')
    .command('new <项目名> [页面名称]', '添加项目')
    .command('add <项目名> <页面名称>', '新增页面')
    .command('remove <项目名> [页面名称]', '删除项目或者页面')
    .parse(process.argv);
