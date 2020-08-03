const Categories = require('../models/Category');

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
        ]), r => r );

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
};


module.exports = CategoryController;
