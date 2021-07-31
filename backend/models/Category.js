const { UseCollection } = require("@xpresser/xpress-mongo");
const { XMongoModel, is } = require("xpress-mongo");

class Category extends XMongoModel {
  static schema = {
    name: is.String().required(),
    addedAt: is.Date().required()
  };
}

UseCollection(Category, "categories");

module.exports = Category;
