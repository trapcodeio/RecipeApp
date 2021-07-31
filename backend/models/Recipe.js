const { UseCollection } = require("@xpresser/xpress-mongo");
const { is, XMongoModel } = require("xpress-mongo");
const { $ } = require("../../recipe-app");

class Recipe extends XMongoModel {
  static append = ["imageUrl"];

  static schema = {
    addedAt: is.Date().required(),
    updatedAt: is.Date().optional(),
    publishedAt: is.Date().optional(),
    title: is.String().required(),
    image: is.String().required(),
    category: is.String().required(),
    calories: is.String().required(),
    duration: is.String().required(),
    difficulty: is.String().required(),
    method: is.String().required(),
    preparation: is.String().optional(),
    status: is.String().required()
  };

  imageUrl() {
    if (!this.data.image) return null;
    return $.helpers.url("storage" + this.data.image);
  }
}

UseCollection(Recipe, "recipes");

module.exports = Recipe;
