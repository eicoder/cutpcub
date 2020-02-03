const glob = require('glob');

glob.sync('./src/projects/bi/').forEach((entryPath) => {
  console.log(entryPath);
});
