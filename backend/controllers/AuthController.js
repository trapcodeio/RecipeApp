const Category = require("../models/Category");
const { $ } = require("../../recipe-app");
const adminUsername = $.env("adminUsername");
const adminPassword = $.env("adminPassword");

/**
 * AuthController
 * @type {Xpresser.Controller.Object}
 */
const AuthController = {
  // Controller Name
  name: "AuthController",
  // Controller Middlewares
  middlewares: {},
  // Controller Default Service Error Handler.
  e: (http, error) => http.toApiFalse({ error }),

  /**
   * Get current logged in user status
   * @param {Xpresser.Http} http
   * @return {any}
   */
  async me(http) {
    let data = {};

    if (http.session.loggedIn) {
      data.user = {
        username: adminUsername
      };

      // get categories
      data.categories = await Category.find({});
    }

    return http.toApi(data);
  },

  /**
   * Example Method.
   * @param {Xpresser.Http} http
   * @param boot
   * @param error
   * @returns {*}
   */
  login(http, boot, error) {
    const required = ["username", "password"];
    const body = http.$body.removeNullOrUndefined();

    if (!body.exists(required)) return error("Missing required login fields");

    const { username, password } = body.pick(required);

    if (username !== adminUsername) return error("Incorrect username!");

    if (password !== adminPassword) return error("Incorrect password!");

    http.session.loggedIn = true;

    return http.toApi({
      message: "Login Successful"
    });
  },

  /**
   * Logout user
   * @param {Xpresser.Http} http
   */
  logout(http) {
    delete http.session.loggedIn;

    return http.toApi({
      message: "Logout Successful"
    });
  }
};

module.exports = AuthController;
