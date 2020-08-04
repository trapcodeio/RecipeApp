const {ModelExtender, is} = require('../xmongo');
const RecipeSchema = {
    addedAt: is.Date().required(),
    updatedAt: is.Date().isOptional(),
    publishedAt: is.Date().isOptional(),
    title: is.String().required(),
    image: is.String().required(),
    category: is.String().required(),
    calories: is.String().required(),
    duration: is.String().required(),
    difficulty: is.String().required(),
    method: is.String().required(),
    preparation: is.String().isOptional(),
    status: is.String().required()
}

class Recipe extends ModelExtender('recipes') {

    static append = ['imageUrl']

    constructor() {
        super();
        this.useSchema(RecipeSchema);
    }

    imageUrl() {
        if (!this.data.image) return null;
        return $.helpers.url('storage' + this.data.image);
    }

}

module.exports = Recipe;
