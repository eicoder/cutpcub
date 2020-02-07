const glob = require('glob');

glob.sync('./src/projects/bi/pages').forEach((entryPath) => {
  console.log(entryPath);
});
