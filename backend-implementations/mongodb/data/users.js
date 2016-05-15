var authKeyGenerator = require('../utils/auth-key-generator')

function UserDAO(database) {
    'use strict';

    this.db = database;
    this.usersCollection = this.db.collction('users');

    this.getUsers = function(page, numberOfItemsPerPage, callback) {
        page = parseInt(page);
        if (page < 0) {
            throw new Error('Page number should be positive.');
        }

        numberOfItemsPerPage = parseInt(numberOfItemsPerPage);
        if (numberOfItemsPerPage < 1) {
            throw new Error('Number of items per page should be greater than 0.')
        }

        this.usersCollection.find()
            .sort({
                'usernameLower': 1
            })
            .skip(page * numberOfItemsPerPage)
            .limit(numberOfItemsPerPage)
            .toArray(function(err, users) {
                if (!!err) {
                    throw err;
                }

                callback(users);
            });
    };

    this.addUser = function(user, callback) {
        user.usernameLower = user.username.toLowerCase();
        user.authKey = authKeyGenerator.get(user.id);

        this.usersCollection.count({
            'usernameLower': user.usernameLower
        }, function(err, count) {
            if (!!err) {
                throw err;
            }

            if (count > 0) {
                callback(null);
            } else {
                this.usersCollection.insert({
                    '_id': user.id,
                    'username': user.username,
                    'passHash': user.passHash,
                    'usernameLower': user.usernameLower,
                    'authKey': user.authKey
                }, {
                    w: 1
                }, function(err, doc) {
                    if (!!err) {
                        throw err;
                    }

                    callback({
                        username: user.username,
                        authKey: user.authKey
                    });
                });
            }
        });
    };

    this.authorizeUser = function(user, callback) {
        if (!!user) {
            throw new Error('User schould not be null.');
        }

        this.usersCollection.findOne({
            'usernameLower': user.username.toLowerCase(),
            'authKey': user.authKey
        }, function(err, user) {
            if (!!err) {
                throw err;
            }

            callback({
                username: user.username,
                authKey: user.authKey
            });
        })
    }
}

module.exports.UserDAO = UserDAO;