const Categories = require("../models/Category");
const Recipe = require("../models/Recipe");
const { omitKeys } = require("xpress-mongo");

/**
 * ApiController
 * @type {Xpresser.Controller.Object}
 */
const ApiController = {
  // Controller Name
  name: "ApiController",
  // Controller Middlewares
  middlewares: {},
  // Controller Default Service Error Handler.
  e: (http, error) => http.status(401).send({ error }),

  /**
   * List all categories
   * @param {Xpresser.Http} http
   */
  async categories(http) {
    const categories = await Categories.fromQuery(
      (q) =>
        q.aggregate([
          {
            $lookup: {
              from: "recipes",
              localField: "name",
              foreignField: "category",
              as: "recipes"
            }
          },

          {
            $project: {
              _id: 1,
              name: 1,
              addedAt: 1,
              recipes: { $size: "$recipes" }
            }
          },
          { $sort: { name: 1 } }
        ]),
      (r) => r
    );

    return http.send(categories);
  },

  /**
   * List all recipes
   * @param {Xpresser.Http} http
   * @param boot
   * @param error
   */
  async recipes(http, boot, error) {
    const page = http.query("page", 1);
    const perPage = http.query("limit", 100);
    let category = http.query("category", undefined);
    const search = http.query("search", undefined);

    const where = { status: "published" };

    if (category) {
      if (Categories.isValidId(category)) {
        const categoryId = category;
        category = await Categories.findById(categoryId);

        if (!category) return error(`No category with id: ${categoryId}`);
        where["category"] = category.get("name");
      } else {
        where["category"] = category;
      }
    }

    if (search) {
      where["title"] = new RegExp(`.*${search}.*`, "i");
    }

    const recipes = await Recipe.paginate(page, perPage, where, {
      projection: omitKeys(["addedAt", "updatedAt"])
    });

    // noinspection JSValidateTypes
    recipes.data = Recipe.fromArray(recipes.data);

    return http.send(recipes);
  },

  /**
   * List all recipes
   * @param {Xpresser.Http} http
   * @param boot
   * @param error
   */
  async recipe(http, boot, error) {
    if (http.params.recipe) {
      const recipeId = http.params.recipe;
      const recipe = await Recipe.findById(recipeId, {
        projection: omitKeys(["updatedAt", "addedAt"])
      });

      if (!recipe) {
        return error(`Recipe with id: (${recipeId}) not found!`);
      }

      return http.send(recipe);
    } else {
      return error(`Request missing required params in url (recipeId)`);
    }
  }
};

module.exports = ApiController;
