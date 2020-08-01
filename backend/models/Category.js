const {ModelExtender, is} = require("../xmongo");
// Schema
const CategorySchema = {
    name: is.String().required(),
    addedAt: is.Date().required()
}

class Category extends ModelExtender('categories') {
    constructor() {
        super();
        this.useSchema(CategorySchema);
    }
}

module.exports = Category;
