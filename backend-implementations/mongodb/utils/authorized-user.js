const AUTH_KEY_HEADER_NAME = 'x-auth-key';

var UserDAO = require('../data/users').UserDAO;

module.exports = function(app, db) {
    app.use(function(req, res, next) {
        var authKey = req.headers[AUTH_KEY_HEADER_NAME],
            users = new UserDAO(db);
        
        users.getUserByAuthKey(authKey, function(user) {
            req.user = user || null;
            next();
        });
    });
};