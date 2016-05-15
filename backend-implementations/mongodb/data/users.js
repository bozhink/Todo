var authKeyGenerator = require('../utils/auth-key-generator')

function UserDAO(database) {
    'use strict';

    var usersCollection = database.collection('users');

    this.getUsers = function(page, numberOfItemsPerPage, callback) {
        page = +(page || 0);
        numberOfItemsPerPage = +(numberOfItemsPerPage || 10);

        usersCollection.find()
            .sort({
                'usernameLower': 1
            })
            .skip(page * numberOfItemsPerPage)
            .limit(numberOfItemsPerPage)
            .toArray(function(err, users) {
                if (err != null || users == null) {
                    callback(null);
                } else {
                    callback(users);
                }
            });
    };

    this.addUser = function(user, callback) {
        user.usernameLower = user.username.toLowerCase();
        user.authKey = authKeyGenerator.get(user.id);

        usersCollection.count({
            'usernameLower': user.usernameLower
        }, function(err, count) {
            if (err != null || count > 0) {
                callback(null);
            } else {
                usersCollection.insert({
                    '_id': user.id,
                    'username': user.username,
                    'passHash': user.passHash,
                    'usernameLower': user.usernameLower,
                    'authKey': user.authKey
                }, {
                    w: 1
                }, function(err, doc) {
                    if (err != null) {
                        callback(null);
                    } else {
                        callback({
                            username: user.username,
                            authKey: user.authKey
                        });
                    }
                });
            }
        });
    };

    this.authorizeUser = function(user, callback) {
        usersCollection.findOne({
            'usernameLower': user.username.toLowerCase(),
            'passHash': user.passHash
        }, function(err, user) {
            if (err != null || user == null) {
                callback(null);
            } else {
                callback({
                    username: user.username,
                    authKey: user.authKey
                });
            }
        });
    };

    this.getUserByAuthKey = function(authKey, callback) {
        usersCollection.findOne({
            'authKey': authKey
        }, function(err, user) {
            if (err != null || user == null) {
                callback(null);
            } else {
                callback({
                    username: user.username,
                    authKey: user.authKey
                });
            }
        })
    }
}

module.exports.UserDAO = UserDAO;