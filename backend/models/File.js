const {DBCollection, is} = require("@xpresser/xpress-mongo/util");

const FileSchema = {
    addedAt: is.Date().required(),
    name: is.String().required(),
    path: is.String().required(),
    extension: is.String().required(),
    size: is.Number().required(),
    mimeType: is.String().required()
}
/**
* File Model
* @class
*/
class File extends DBCollection('files') {

    constructor() {
        super();
        this.useSchema(FileSchema)
    }

}

module.exports = File;
