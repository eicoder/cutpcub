#!/usr/bin/env node

const program = require('commander');

program
    .version(require('../package').version, '-v --version')
    .command('init', '初始化工程')
    .command('fetch', '更新模版')
    .command('new', '添加项目')
    .command('add', '新增页面')
    .command('add2 <x>', '新增页面')
    .parse(process.argv);
