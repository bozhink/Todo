var express = require('express'),
    UserDAO = require('../data/users').UserDAO;

module.exports = function (db) {
    'use strict';

    var router = express.Router(),
        users = new UserDAO(db);

    router
        .get('/', function (req, res) {
            var page = +(req.query.page || 0),
                size = +(req.query.size || 10);

            users.getUsers(page, size, function (users) {
                res.json({
                    result: users
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
            var user = req.body || {};
            users.authorizeUser(user, function (user, err) {
                if (!!err || !user) {
                    res.status(400)
                        .json(JSON.stringify(err));
                    return;
                }

                res.json({
                    result: user
                });
            });
        });

    return router;
};
