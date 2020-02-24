// metalsmith-renamer 不支持文件夹改名，只能用他的代码进行修改了

var minimatch = require('minimatch'),
    path      = require('path');

module.exports = plugin;

function plugin(options) {
  return function(files, metalsmith, done) {
    Object.keys(options).forEach(function(opt) {
      var folder = options[opt].folder;
      Object.keys(files).forEach(function(file) {
        if (!minimatch(file, options[opt].pattern, { dot: true })) {
          return;
        }
        var rename = options[opt].rename || path.basename(file);
        var renamedEntry = path.dirname(file) + '/';
        if (folder) {
          renamedEntry = renamedEntry.replace(new RegExp(...folder.regExp), folder.rename);
        }

        if (renamedEntry === './') {
          renamedEntry = '';
        }
        if (typeof rename === 'function') {
          renamedEntry += rename(path.basename(file));
        } else {
          renamedEntry += rename;
        }

        if (renamedEntry !== file) {
          files[renamedEntry] = files[file];
          delete files[file];
        }
      });
    });
    done();
  };
}
