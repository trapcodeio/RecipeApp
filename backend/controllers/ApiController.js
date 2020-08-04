const Categories = require('../models/Category');
const Recipe = require('../models/Recipe');
const {pickKeys, omitKeys} = require('xpress-mongo');

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
    e: (http, error) => http.status(400).send({error}),


    /**
     * List all categories
     * @param {Xpresser.Http} http
     * @return {Promise<void>}
     */
    async categories(http) {
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
                    _id: 0,
                    name: 1,
                    addedAt: 1,
                    recipes: {$size: "$recipes"}
                }
            },
            {$sort: {name: 1}}
        ]), r => r);

        return http.send(categories);
    },

    /**
     * List all recipes
     * @param {Xpresser.Http} http
     * @return {Promise<void>}
     */
    async recipes(http) {
        const page = http.query('page', 1);
        const perPage = http.query('limit', 100);
        const category = http.query('category', undefined);
        const search = http.query('search', undefined);

        const where = {status: 'published'};

        if (category) {
            where['category'] = category;
        }

        if (search) {
            where['title'] = new RegExp(`.*${search}.*`, 'i')
        }

        const recipes = await Recipe.paginate(page, perPage, where, {
            projection: pickKeys([
                'title',
                'category',
                'duration',
                'difficulty',
                'image',
                'publishedAt'
            ])
        });

        return http.send(recipes);
    },

    /**
     * List all recipes
     * @param {Xpresser.Http} http
     * @param boot
     * @param error
     * @return {Promise<void>}
     */
    async recipe(http, boot, error) {

        if (http.params.recipe) {
            const recipeId = http.params.recipe;
            const recipe = await Recipe.findById(recipeId, {
                projection: omitKeys([
                    'updatedAt',
                    'addedAt'
                ])
            });

            if (!recipe) {
                return error(`Recipe with id: (${recipeId}) not found!`);
            }

            return http.send(recipe);
        } else {
            return error(`Request missing required params in url (recipeId)`)
        }
    }

};


module.exports = ApiController;
