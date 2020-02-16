const exists = require('fs').existsSync;
const Metalsmith = require('metalsmith');
const match = require('minimatch');
const path = require('path');

module.exports = function generate(name, src, dest, done) {
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
};

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
