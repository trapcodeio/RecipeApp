const {Client, XMongoModel, is} = require('xpress-mongo')
const config = $.$config.get('mongodb', {});
const XMongoConnection = Client(config.url, config.options);

exports.ModelExtender = (collection) => {
    return class extends XMongoModel {
        static thisCollection() {
            return XMongoConnection.collection(collection)
        }
    }
}

exports.XMongoConnection = XMongoConnection;
exports.XMongoModel = XMongoModel;
exports.is = is;