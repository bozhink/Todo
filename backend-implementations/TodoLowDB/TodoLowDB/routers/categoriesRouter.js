var express = require('express'),
    _ = require('lodash');

require('../polyfills/array');

module.exports = function (db) {
    var router = express.Router(),
        usersCollection = db('users');

    router.get('/', function (req, res) {
        var categories, user = req.user;
        if (!user) {
            res.status(401)
                .json('Not authorized User');
            return;
        }

        categories = usersCollection.map(function (user) {
            var todoCategories = [],
                eventCategories = [];

            if (user.todos) {
                todoCategories = user.todos.map((todo) => todo.category);
            }

            if (user.events) {
                eventCategories = user.events.map((event) => event.category);
            }

            return todoCategories.concat(eventCategories);
        });

        categories = _.chain(categories)
            .flatten(categories, true)
            .sortBy(function (cat) {
                return cat.toLowerCase();
            })
            .uniq()
            .value();

        res.json({
            result: categories
        });
    });

    return router;
};
