const exists = require('fs').existsSync;
const Metalsmith = require('metalsmith');
const match = require('minimatch');
const render = require('consolidate').handlebars.render;
const path = require('path');

const renamer = require('./renamer');

module.exports = function generate(type, params) {
  switch (type) {
    case 'init':
      generateInit(...params);
      break;
    case 'project':
      generateProject(...params);
      break;
    case 'page':
      generatePage(...params);
      break;
  }
};

function generateInit(name, src, dest, done) {
  const metalsmith = Metalsmith(path.join(src, 'template'));
  const filterJs = path.join(src, 'filter.js');
  if (!exists(filterJs)) {
    throw new Error('缺少filter.js文件');
  }
  const filter = require(path.resolve(filterJs));
  metalsmith.use(filterFiles(filter.init));

  metalsmith
      .source('.')
      .destination(dest)
      .build((err, files) => {
        done(err);
      });
}

function generateProject(name, src, dest, done) {
  // 判断是否覆盖
  const metalsmith = Metalsmith(path.join(src, 'template/src'));
  const filterJs = path.join(src, 'filter.js');
  const renameJs = path.join(src, 'rename.js');
  if (!exists(filterJs)) {
    throw new Error('缺少filter.js文件');
  }
  const filter = require(path.resolve(filterJs));
  metalsmith.use(filterFiles(filter.project));
  if (exists(renameJs)) {
    let rename = require(path.resolve(renameJs)).project;
    if (rename) {
      rename = JSON.stringify(rename).replace(/\[projectName\]/g, name);
      rename = JSON.parse(rename);
      metalsmith.use(renamer(rename));
    }
  }
  metalsmith
      .clean(false)
      .source('.')
      .destination(path.join(dest, 'src'))
      .build((err, files) => {
        done(err);
      });
}

function generatePage(projectName, pageName, src, dest, done) {
// 判断是否覆盖
  const metalsmith = Metalsmith(path.join(src, 'template/src/projects/projectName'));
  console.log(dest);
  const filterJs = path.join(src, 'filter.js');
  if (!exists(filterJs)) {
    throw new Error('缺少filter.js文件');
  }
  const filter = require(path.resolve(filterJs));
  metalsmith.use(filterFiles(filter.page));
  const rename = {
    page: {
      pattern: 'pages/pageName/**',
      folder: {
        regExp: ['pageName', 'g'],
        rename: pageName
      }
    }
  };
  metalsmith.use(renamer(rename));
  metalsmith.use(renderTemplate({
    projectName,
    pageName
  }));
  metalsmith
      .clean(false)
      .source('.')
      .destination(dest)
      .build((err, files) => {
        done(err);
      });
}

function renderTemplate(data) {
  return (files, metalsmith, done) => {
    const keys = Object.keys(files);
    keys.forEach((file) => {
      const str = files[file].contents.toString();
      if (str) {
        render(str, data, (err, res) => {
          if (err) {
            err.message = `[${file}] ${err.message}`;
            throw new Error(err);
          }
          files[file].contents = Buffer.from(res);
        })
      }
      done();
    });
  }
}

function filterFiles (filters) {
  return (files, metalsmith, done) => {
    filter(files, filters, done)
  }
}

function filter(files, filters, done) {
  if (!filters) {
    return done()
  }
  const fileNames = Object.keys(files);
  filters.forEach((glob) => {
    fileNames.forEach(file => {
      if (match(file, glob, { dot: true })) {
        delete files[file];
      }
    })
  });
  done();
}
