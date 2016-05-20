var express = require('express'),
    UserDAO = require('../data/users').UserDAO;

module.exports = function (db) {
    'use strict';

    var router = express.Router(),
        usersCollection = db('users'),
        users = new UserDAO(db);

    router
        .get('/', function (req, res) {
            var page = +(req.query.page || 0),
                size = +(req.query.size || 10);

            users.getUsers(page, size, function (users) {
                res.json({
                    result: users || []
                });
            });
        })
        .post('/', function (req, res) {
            var user = req.body || {};
            users.addUser(user, function (user, err) {
                if (!!err || !user) {
                    res.status(400)
                        .json(JSON.stringify(err));
                    return;
                }

                res.status(201)
                    .json({
                        result: user
                    });
            });
        })
        .put('/auth', function (req, res) {
            var dbUser, user = req.body || {};
            user.passHash = user.passHash || undefined;
            user.usernameLower = (user.username || '').toLowerCase();

            dbUser = usersCollection.find({
                usernameLower: user.usernameLower
            });

            if (user.passHash === undefined || user.usernameLower === '' || !dbUser || dbUser.passHash !== user.passHash) {
                res.status(404)
                    .json('Username or password is invalid');
                return;
            }

            res.json({
                result: {
                    username: dbUser.username,
                    authKey: dbUser.authKey
                }
            });
        });

    return router;
};
