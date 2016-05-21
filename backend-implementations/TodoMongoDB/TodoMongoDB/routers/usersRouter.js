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

            users.getUsers(page, size, function (err, users) {
                if (!!err || !users) {
                    res.status(400)
                        .json(err);
                    return;
                }

                res.json({
                    result: users
                });
            });
        })
        .post('/', function (req, res) {
            var user = req.body || {};
            users.addUser(user, function (err, user) {
                if (!!err || !user) {
                    res.status(400)
                        .json(err);
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
            users.authorizeUser(user, function (err, user) {
                if (!!err || !user) {
                    res.status(400)
                        .json(err);
                    return;
                }

                res.json({
                    result: user
                });
            });
        });

    return router;
};
