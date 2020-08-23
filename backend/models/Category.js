const {DBCollection, is} = require("@xpresser/xpress-mongo/util");
// Schema
const CategorySchema = {
    name: is.String().required(),
    addedAt: is.Date().required()
}



class Category extends DBCollection('categories') {
    constructor() {
        super();
        this.useSchema(CategorySchema);
    }
}

module.exports = Category;
