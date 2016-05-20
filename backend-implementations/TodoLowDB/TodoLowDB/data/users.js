const DEFAULT_NUMBER_OF_ITEMS_PER_PAGE = 10;

var uuid = require('uuid'),
    authKeyGenerator = require('../utils/auth-key-generator');

function UserDAO(db) {
    'use strict';

    var usersCollection = db('users');

    function getUsers(page, size, callback) {
        page = +(page || 0);
        size = +(size || DEFAULT_NUMBER_OF_ITEMS_PER_PAGE);

        var users = usersCollection.chain()
            .sortBy('username')
            .slice(page * size)
            .take(size)
            .value();

        callback(users || []);
    }

    function addUser(user, callback) {
        var dbUser;
        user = user || {};

        try {
            user.id = uuid();
            user.usernameLower = user.username.toLowerCase();
            user.authKey = authKeyGenerator.get(user.id);
        } catch (e) {
            callback(null, 'User is invalid.');
            return;
        }

        dbUser = usersCollection.find({
            usernameLower: user.usernameLower
        });

        if (dbUser) {
            callback(null, 'Username is already taken.');
            return;
        }

        usersCollection.push(user);

        callback(user);
    }

    function authorizeUser(user, callback) {
        var dbUser;
        user = user || {};
        user.passHash = user.passHash || undefined;
        user.usernameLower = (user.username || '').toLowerCase();

        dbUser = usersCollection.find({
            usernameLower: user.usernameLower
        });

        if (user.passHash === undefined || user.usernameLower === '' || !dbUser || dbUser.passHash !== user.passHash) {
            callback(null, 'Username or password is invalid');
        }

        callback({
            username: dbUser.username,
            authKey: dbUser.authKey
        });
    }

    function getUserByAuthKey(authKey, callback) {
        var user = usersCollection.find({
            authKey: authKey
        });

        callback(user || null);
    }

    return {
        getUsers,
        addUser,
        authorizeUser,
        getUserByAuthKey
    };
}

module.exports.UserDAO = UserDAO;
