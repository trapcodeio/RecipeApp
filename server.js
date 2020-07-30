const xpresser = require('xpresser');
const config = require('./server.config');

// Xpresser
const $ = xpresser(config);

// Inject Mongo
$.on.start([
    next => require('./backend/InjectMongo')(next),
]);


// Boot Server
$.boot();