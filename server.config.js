const envLoader = require('@xpresser/env');
const base = __dirname;
const env = envLoader(base);

const mongo_pass = encodeURI(env['MongoPassword']);
const mongo_server = (env['MongoServer'] || '').replace('<password>', mongo_pass);

module.exports = {
    name: 'Cooking',
    paths: {
        base
    },
    server: {
        port: env['AppPort'],
        use: {
            session: true
        }
    },
    session: {
        startOnBoot: true,
        secretKey: '@@CookingStuff@@'
    },
    mongodb: {
        url: mongo_server,
        database: 'cooking',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
}