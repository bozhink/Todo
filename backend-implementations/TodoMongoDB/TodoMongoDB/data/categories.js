var _ = require('lodash');

function CategoryDAO(db) {
    'use strict';

    var usersCollection = db.collection('users'),
        eventsCollection = db.collection('events');

    function getAllCategories(callback) {
        eventsCollection
            .aggregate([{
                '$group': {
                    '_id': '$category'
                }
            }])
            .toArray(function(err, eventCategories) {
                if (!!err) {
                    callback(err, null);
                    return;
                }

                usersCollection
                    .aggregate([{
                        '$unwind': '$todos'
                    }, {
                        '$group': {
                            '_id': '$todos.category'
                        }
                    }])
                    .toArray(function(err, todoCategories) {
                        var categories;
                        if (!!err) {
                            callback(err, null);
                            return;
                        }

                        categories = _.chain(todoCategories.concat(eventCategories).map((g) => g._id) || [])
                            .sortBy((category) => category.toLowerCase())
                            .uniq()
                            .value();

                        callback(null, categories || []);
                    })
            });
    }

    return {
        getAllCategories
    };
}

module.exports.CategoryDAO = CategoryDAO;