const Sharp = require("sharp");
const Recipe = require("../models/Recipe");
const { Abolish, ParseRules } = require("abolish");
const { $ } = require("../../recipe-app");
const { Obj } = require("object-collection/exports");
const abolish = new Abolish();
abolish.addValidators([
  require("abolish/validators/string/json"),
  require("abolish/validators/string/jsonDecode")
]);

const ValidateRecipeRule = ParseRules({
  title: "must|minLength:3",
  category: "must|minLength:3",
  calories: "must|minLength:1",
  difficulty: "must",
  duration: "must",
  ingredients: "must|json|jsonDecode",
  preparation: {
    must: true,
    minLength: 10,
    $skip: (str) => !str
  },
  method: "must"
});

/**
 * Resize image after upload
 */
const resizeImage = ($file) => {
  const newFileName = $file + ".resize";
  Sharp($file)
    .resize({
      width: 500,
      fit: "cover"
    })
    .toFile(newFileName)
    .then(() => {
      $.file.delete($file);
      $.file.fs().renameSync(newFileName, $file);
    })
    .catch($.logError);
};

const deleteImage = (path) => {
  const image = $.path.storage("public" + path);
  $.file.delete(image);
};

/**
 * RecipeController
 * @type {Xpresser.Controller.Object}
 */
const RecipeController = {
  // Controller Name
  name: "RecipeController",
  // Controller Middlewares
  middlewares: {},
  // Controller Default Service Error Handler.
  e: (http, error) => http.toApiFalse({ error }),

  /**
   * Boot this controller
   * @param {Xpresser.Http} http
   * @param error
   * @return {Promise<void>}
   */
  async boot(http, error) {
    const data = {};

    if (http.params.recipe) {
      const recipe = http.params.recipe;
      data.recipe = await Recipe.findById(recipe);

      if (!data.recipe) {
        return error(`Recipe with id: (${recipe}) not found!`);
      }
    }

    return data;
  },

  /**
   * List all recipes
   * @param http
   * @return {Promise<void>}
   */
  async all(http) {
    const page = http.query("page", 1);
    const category = http.query("category", undefined);
    const search = http.query("search", undefined);

    const where = {};

    if (category) {
      where["category"] = category;
    }

    if (search) {
      where["title"] = new RegExp(`.*${search}.*`, "i");
    }

    const recipes = await Recipe.paginate(page, 30, where);
    return http.toApi({
      recipes
    });
  },

  /**
   * Add recipe
   * @param {Xpresser.Http} http
   * @param boot
   * @param e
   */
  async add(http, boot, e) {
    const image = await http.file("image", {
      mimetype: "image"
    });

    if (image.error()) {
      const uploadError = image.error();
      if (uploadError.type === "input") {
        return e("Recipe image is missing.");
      } else {
        return e(uploadError.message);
      }
    }

    const body = Obj(image.body).allWithoutNullOrUndefined();
    const [error, validated] = abolish.validate(body, ValidateRecipeRule);

    if (error) {
      image.discard();
      return e(error.message);
    }

    // save image
    const folder = $.path.storage("public");
    await image.saveTo(folder + "/recipes", {
      name: $.helpers.randomStr(20),
      prependExtension: true
    });

    if (image.saveError()) {
      return e(image.saveError());
    }

    // get file relative path
    image.path = image.path.replace(folder, "");
    const recipe = Recipe.make(validated).set({
      image: image.path,
      status: "draft"
    });

    // Save recipe
    await recipe.save();

    return http.toApi({
      message: `Recipe (${recipe.data.title}) added successfully`
    });
  },

  /**
   * View Recipe
   * @param {Xpresser.Http} http
   * @param recipe
   * @return {Promise<any>}
   */
  async view(http, { recipe }) {
    return http.toApi({ recipe });
  },

  /**
   * Edit Recipe
   * @param {Xpresser.Http} http
   * @param recipe
   * @param e
   * @return {Promise<any>}
   */
  async edit(http, { recipe }, e) {
    let hasNewImage = true;
    const image = await http.file("image", {
      mimetype: "image"
    });

    if (image.error()) {
      hasNewImage = false;
      const uploadError = image.error();
      if (uploadError.type !== "input") {
        return e(uploadError.message);
      }
    }

    const body = $.objectCollection(image.body).allWithoutNullOrUndefined();

    const [error, validated] = abolish.validate(body, {
      title: "must|minLength:3",
      category: "must|minLength:3",
      calories: "must|minLength:1",
      difficulty: "must",
      duration: "must",
      ingredients: "must|json|jsonDecode",
      preparation: {
        must: true,
        minLength: 10,
        $skip: (str) => !str
      },
      method: "must"
    });

    if (error) {
      return e(error.message);
    }

    if (hasNewImage) {
      // save image
      const folder = $.path.storage("public");
      await image.saveTo(folder + "/recipes", {
        name: $.helpers.randomStr(20),
        prependExtension: true
      });

      if (image.saveError()) {
        return e(image.saveError());
      }

      resizeImage(image.path);

      // get file relative path
      image.path = image.path.replace(folder, "");
      // Update
      const oldImage = recipe.get("image");
      recipe.set("image", image.path);

      // Delete old recipe
      deleteImage(oldImage);
    }

    let message = `Recipe (${recipe.data.title}) UPDATED successfully`;
    if (body.status === "publish") {
      message = `Recipe (${recipe.data.title}) PUBLISHED successfully`;
      recipe.set({
        status: "published",
        publishedAt: new Date()
      });
    } else if (body.status === "unpublish") {
      message = `Recipe (${recipe.data.title}) UNPUBLISHED successfully`;
      recipe.set({
        status: "draft",
        publishedAt: undefined
      });
    }

    if (recipe.data.preparation && !validated.preparation) {
      recipe.set("preparation", undefined);
    }

    // Save recipe
    await recipe.update(validated);

    return http.toApi({
      message
    });
  },

  /**
   * Delete Recipe
   * @param {Xpresser.Http} http
   * @param recipe
   * @return {Promise<any>}
   */
  async delete(http, { recipe }) {
    const title = recipe.get("title");
    const image = recipe.get("image");
    await recipe.delete();

    // delete image
    deleteImage(image);

    return http.toApi({ message: `Recipe (${title}) deleted successfully.` });
  }
};

module.exports = RecipeController;
