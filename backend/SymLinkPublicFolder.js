const PathHelper = require("xpresser/dist/src/Helpers/Path");

module.exports = (next, $) => {
  $.ifNotConsole(() => {
    const fs = $.file.fs();

    const storageFiles = $.path.storage("public");
    const publicPath = $.path.base("dist/storage");

    if (!fs.existsSync(publicPath)) {
      if (!fs.existsSync(storageFiles)) {
        PathHelper.makeDirIfNotExist(storageFiles);
      }

      try {
        fs.symlinkSync(storageFiles, publicPath);
      } catch (e) {
        $.logError(e);
      }
    }
  });

  return next();
};
