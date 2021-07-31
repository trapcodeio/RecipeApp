const xpresser = require("xpresser");
const config = require("./server.config");

// Xpresser
const $ = xpresser.init(config, { exposeDollarSign: false });

$.on.boot([(next, $) => require("./backend/SymLinkPublicFolder")(next, $)]);

// Boot Server
$.boot();

module.exports = { $ };
