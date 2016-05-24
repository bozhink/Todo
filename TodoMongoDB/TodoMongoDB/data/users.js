const DEFAULT_NUMBER_OF_ITEMS_PER_PAGE = 10;

var authKeyGenerator = require('../utils/auth-key-generator'),
    uuid = require('uuid');

function UserDAO(db) {
    'use strict';

    var usersCollection = db.collection('users');

    function getUsers(page, size, callback) {
        page = +(page || 0);
        size = +(size || DEFAULT_NUMBER_OF_ITEMS_PER_PAGE);

        usersCollection.find({})
            .sort({
                'username': 1
            })
            .skip(page * size)
            .limit(size)
            .toArray(function(err, users) {
                callback(err, users || []);
            });
    }

    function addUser(user, callback) {
        user = user || {};

        try {
            user.usernameLower = user.username.toLowerCase();
            user.authKey = authKeyGenerator.get(uuid());
        } catch (e) {
            callback('User is invalid', null);
            return;
        }

        usersCollection.findOne({
            'usernameLower': user.usernameLower
        }, function(err, dbUser) {
            if (!!err) {
                callback(err, null);
                return;
            }

            if (!!dbUser) {
                callback('Username is already taken.', null);
                return;
            }

            usersCollection.insert(user, {
                w: 1
            }, function(err, result) {
                callback(err, user);
            });
        });
    }

    function authorizeUser(user, callback) {
        user = user || {};
        user.passHash = user.passHash || undefined;
        user.usernameLower = (user.username || '').toLowerCase();

        usersCollection.findOne({
            'usernameLower': user.usernameLower
        }, function(err, dbUser) {
            if (!!err) {
                callback(err, null);
                return;
            }

            if (user.passHash === undefined || user.usernameLower === '' || !dbUser || dbUser.passHash !== user.passHash) {
                callback('Username or password is invalid', null);
                return;
            }

            callback(null, {
                username: dbUser.username,
                authKey: dbUser.authKey
            });
        });
    }

    function getUserByAuthKey(authKey, callback) {
        usersCollection.findOne({
            'authKey': authKey
        }, function(err, user) {
            callback(err, user || null);
        });
    }

    return {
        getUsers,
        addUser,
        authorizeUser,
        getUserByAuthKey
    };
}

module.exports.UserDAO = UserDAO;