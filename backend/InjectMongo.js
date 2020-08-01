const {XMongoConnection} = require('./xmongo');


module.exports = (next) => {
    const config = $.$config.get('mongodb', {});


    XMongoConnection.connect()
        .then(client => {
            $.ifNotConsole(() => $.logInfo('Connected to mongodb'))

            client.useDb(config.database);

            return next()
        })
        .catch(err => {
            console.log(err);
            $.logErrorAndExit("Error connecting to mongodb!")
        });
};