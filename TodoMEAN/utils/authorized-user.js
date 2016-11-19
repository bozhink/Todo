const AUTH_KEY_HEADER_NAME = 'x-auth-key';

var UserDAO = require('../data/users').UserDAO;

module.exports = function (app, db) {
    'use strict';

    var users = new UserDAO(db);

    app.use(function (req, res, next) {
        var authKey = req.headers[AUTH_KEY_HEADER_NAME];
        users.getUserByAuthKey(authKey, function (err, user) {
            req.user = user || null;
            next();
        });
    });
};
