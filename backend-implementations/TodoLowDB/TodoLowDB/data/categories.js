var _ = require('lodash');

function CategoryDAO(db) {
    'use strict';

    var usersCollection = db('users');

    function getAllCategories(callback) {
        var categories = usersCollection.map(function (user) {
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
            .sortBy((category) => category.toLowerCase())
            .uniq()
            .value();

        callback(categories);
    }

    return {
        getAllCategories
    };
}

module.exports.CategoryDAO = CategoryDAO;
