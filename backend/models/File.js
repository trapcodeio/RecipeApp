const { is, XMongoModel } = require("xpress-mongo");
const { UseCollection } = require("@xpresser/xpress-mongo");

/**
 * File Model
 * @class
 */
class File extends XMongoModel {
  static schema = {
    addedAt: is.Date().required(),
    name: is.String().required(),
    path: is.String().required(),
    extension: is.String().required(),
    size: is.Number().required(),
    mimeType: is.String().required()
  };
}

UseCollection(File, "files");

module.exports = File;
