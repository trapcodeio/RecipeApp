const Categories = require('../models/Category');
const Recipe = require('../models/Recipe');

/**
 * CategoryController
 * @type {Xpresser.Controller.Object}
 */
const CategoryController = {
    // Controller Name
    name: "CategoryController",
    // Controller Middlewares
    middlewares: {},
    // Controller Default Service Error Handler.
    e: (http, error) => http.toApiFalse({error}),


    /**
     * List all categories
     * @param {Xpresser.Http} http
     * @return {Promise<void>}
     */
    async all(http) {
        const categories = await Categories.fromArray(q => q.aggregate([
            {
                $lookup: {
                    from: "recipes",
                    localField: "name",
                    foreignField: "category",
                    as: "recipes"
                },
            },

            {
                $project: {
                    name: 1,
                    addedAt: 1,
                    recipes: {$size: "$recipes"}
                }
            }
        ]), r => r);

        return http.toApi({
            categories
        })
    },

    /**
     * Create new category
     * @param {Xpresser.Http} http
     * @param boot
     * @param error
     * @return {Promise<void>}
     */
    async create(http, boot, error) {
        let category = http.body('name', '').trim();

        if (!category)
            return error('Name of category is required');

        // check if category exists
        const hasCategory = await Categories.count({
            name: new RegExp('^' + category + '$', "i")
        });

        if (hasCategory)
            return error(`Category with name (${category}) already exists.`);

        await Categories.new({name: category});

        return http.toApi({
            message: `Category (${category}) added successfully.`
        });
    },


    /**
     * Delete a category
     * @param {Xpresser.Http} http
     * @param boot
     * @param error
     * @return {Promise<*>}
     */
    async delete(http, boot, error) {
        const categoryId = http.body('category', undefined);

        if (!categoryId)
            return error('Category ID is missing! reload browser and try again');

        const category = await Categories.findById(categoryId);
        if (!category)
            return error(`No category found with id: (${categoryId}), maybe already be deleted`);

        const nameOfCategory = category.get('name');
        const hasRecipes = await Recipe.count({category: category.data.name});
        if (hasRecipes)
            return error(`Category (${nameOfCategory}) has recipes in it, delete recipes before deleting this category.`)

        await category.delete();

        return http.toApi({
            message: `Category: (${nameOfCategory}) has been deleted successfully.`
        });
    },


    /**
     * Rename category
     * @param {Xpresser.Http} http
     * @param boot
     * @param error
     * @return {Promise<*>}
     */
    async rename(http, boot, error) {
        const body = http.body().removeNullOrUndefined();
        const required = ['rename', 'name'];

        if (!body.exists(required))
            return error(`Request requires parameters (${required.join('|')})`)

        let {rename, name} = body.pick(required);
        rename = rename.trim();
        name = name.trim();

        if (!name)
            return error('New name of category is required');

        // find category
        const category = await Categories.findById(rename);

        if (!category) {
            return error('Category to rename is not found, maybe already deleted!')
        }

        // check if category exists
        const hasCategory = await Categories.count({
            name: new RegExp('^' + name + '$', "i")
        });

        if (hasCategory)
            return error(`Category with name (${category.data.name}) already exists.`);

        // Save old name to variable
        const oldName = category.get('name');
        // change category name
        await category.update({name});
        // Rename all recipes from oldName to newName
        await Recipe.thisCollection().updateMany({
            category: oldName
        }, {$set: {category: name}})

        return http.toApi({message: `Category (${oldName}) renamed to (${name}) successfully`})
    }
};


module.exports = CategoryController;
