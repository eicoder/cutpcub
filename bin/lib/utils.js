const path = require('path');

exports.getTemplatePath = function getTemplatePath (templatePath) {
  return path.isAbsolute(templatePath)
      ? templatePath
      : path.normalize(path.join(process.cwd(), templatePath));
};
