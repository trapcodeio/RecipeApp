/**
 * AuthMiddleware
 */
module.exports = {

    // Default middleware action
    logged(http) {
        // run check here
        if (!http.session.loggedIn) {
            return http.status(401).send({error: `You are not allowed to access this route!`})
        }

        return http.next();
    }

};
