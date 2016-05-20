var express = require('express'),
    uuid = require('uuid'),
    authKeyGenerator = require('../utils/auth-key-generator');

module.exports = function (db) {
    var router = express.Router(),
        usersCollection = db('users');

    router
        .get('/', function (req, res) {
            var page = +(req.query.page || 0),
                size = +(req.query.size || 10);

            var users = usersCollection.chain()
                .sortBy('username')
                .slice(page * size)
                .take(size)
                .value();

            res.json({
                result: users || []
            });
        })
        .post('/', function (req, res) {
            var dbUser, user = req.body || {};

            try {
                user.id = uuid();
                user.usernameLower = user.username.toLowerCase();
                user.authKey = authKeyGenerator.get(user.id);
            } catch (e) {
                res.status(400)
                    .json('User is invalid.');
                return;
            }

            dbUser = usersCollection.find({
                usernameLower: user.usernameLower
            });

            if (dbUser) {
                res.status(400)
                    .json('Username is already taken.');
                return;
            }

            usersCollection.push(user);

            res.status(201)
                .json({
                    result: user
                });
        })
        .put('/auth', function (req, res) {
            var dbUser, user = req.body || {};
            user.passHash = user.passHash || undefined;
            user.usernameLower = (user.username || '').toLowerCase();

            dbUser = usersCollection.find({
                usernameLower: user.usernameLower
            });

            if (user.passHash === undefined ||
                user.usernameLower === '' ||
                !dbUser ||
                dbUser.passHash !== user.passHash) {
                res.status(404)
                    .json('Username or password is invalid');
                return;
            }

            res.json({
                result: {
                    username: dbUser.username,
                    authKey: dbUser.authKey
                }
            });
        });

    return router;
};
