var express = require('express'),
    CategoryDAO = require('../data/categories').CategoryDAO;

module.exports = function (db) {
    'use strict';

    var router = express.Router(),
        categories = new CategoryDAO(db);

    router.get('/', function (req, res) {
        var user = req.user;
        if (!user) {
            res.status(401)
                .json('Not authorized User');
            return;
        }

        categories.getAllCategories(function (categories) {
            res.json({
                result: categories
            });
        });
    });

    return router;
};
