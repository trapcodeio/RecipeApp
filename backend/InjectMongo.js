const {XMongoConnection} = require('./xmongo');


module.exports = (next) => {
    const config = $.$config.get('mongodb', {});

    $.logIfNotConsole("Connecting to mongodb...");

    XMongoConnection.connect()
        .then(client => {
            client.useDb(config.database);
            return next()
        })
        .catch(err => {
            console.log(err);
            $.logErrorAndExit("Error connecting to mongodb!")
        });
};