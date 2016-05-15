var express = require('express'),
    idGenerator = require('../utils/id-generator')(),
    authKeyGenerator = require('../utils/auth-key-generator'),
    UserDAO = require('../data/users').UserDAO;

module.exports = function(db) {
    var router = express.Router(),
        users = new UserDAO(db);

    router.get('/', function(req, res) {
            var page = +(req.query.page || 0),
                size = +(req.query.size || 10);

            users.getUsers(page, size, function(users) {
                res.json({
                    result: users || []
                });
            });
        })
        .post('/', function(req, res) {
            var user = req.body;
            console.log(user);

            users.addUser(user, function(user) {
                if (user == null) {
                    res.status(400)
                        .json('User cannot be created.');
                } else {
                    res.status(201)
                        .json({
                            result: user
                        });
                }
            });
        })
        .put('/auth', function(req, res) {
            var user = req.body;
            users.authorizeUser(user, function(user) {
                if (user == null) {
                    res.status(404)
                        .json('Username or password is invalid');
                } else {
                    res.json({
                        result: {
                            username: user.username,
                            authKey: user.authKey
                        }
                    });
                }
            });
        });

    return router;
};