const envLoader = require("@xpresser/env");
const base = __dirname;
const env = envLoader(base);

const isDev = env.NODE_ENV === "development";
const mongo_pass = encodeURI(env["MongoPassword"]);
const mongo_server = (env["MongoServer"] || "").replace("<password>", mongo_pass);

module.exports = {
  name: "Daisy Recipes",
  env: env.NODE_ENV,

  debug: {
    enabled: isDev
  },

  paths: {
    base,
    public: "dist"
  },

  server: {
    domain: env["AppDomain"],
    port: env["AppPort"],
    includePortInUrl: isDev,
    ssl: {
      enabled: env["Ssl"],
      port: env["SslPort"] || 443,
      files: {
        cert: env["SslCert"],
        key: env["SslKey"]
      }
    },
    use: {
      cors: true,
      session: false
    }
  },
  session: {
    startOnBoot: true,
    secretKey: "@@CookingStuff@@",
    cookie: {
      path: "/",
      domain: env["AppDomain"],
      maxAge: 5000 * 60 * 24
    }
  },

  response: {
    cacheFiles: true,
    cacheFileExtensions: ["js", "css", "woff2"]
  },

  mongodb: {
    url: mongo_server,
    database: "cooking",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }
};
